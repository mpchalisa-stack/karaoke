import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import ytSearch from 'yt-search';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ConnectedClient {
  id: string;
  name: string;
  role: 'master' | 'client';
  ws?: WebSocket;
  sseRes?: express.Response;
  connectedAt: number;
  lastSeen?: number;
}

interface RoomState {
  roomId: string;
  currentSong: any | null;
  isPlaying: boolean;
  queue: any[];
  history: any[];
  clients: Map<string, ConnectedClient>;
  lastUpdated: number;
}

// In-memory room repository
const rooms = new Map<string, RoomState>();

function getOrCreateRoom(roomId: string): RoomState {
  const cleanId = (roomId || '').trim().toUpperCase() || 'DEFAULT-ROOM';
  let room = rooms.get(cleanId);
  if (!room) {
    room = {
      roomId: cleanId,
      currentSong: {
        id: 'nCbzF356088',
        title: 'Scorpions - Wind Of Change (Karaoke Version)',
        channelTitle: 'Sing King Karaoke',
        thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=640&q=80',
        duration: '5:10',
        isCurated: true,
      },
      isPlaying: false,
      queue: [
        {
          queueId: 'q-initial-1',
          song: {
            id: 's88r_q7oufE',
            title: 'Bon Jovi - Bed Of Roses (Karaoke With Lyrics)',
            channelTitle: 'Karaoke Star HD',
            thumbnailUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=640&q=80',
            duration: '6:35',
            isCurated: true,
          },
          singerName: 'Budi Slow Rocker',
          addedAt: Date.now(),
        },
        {
          queueId: 'q-initial-2',
          song: {
            id: 'CHekNnySAfM',
            title: 'Bob Marley - Could You Be Loved (Karaoke Lyrics)',
            channelTitle: 'Reggae Jam Karaoke',
            thumbnailUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=640&q=80',
            duration: '3:57',
            isCurated: true,
          },
          singerName: 'Siti Reggae Vibes',
          addedAt: Date.now() + 1000,
        },
        {
          queueId: 'q-initial-3',
          song: {
            id: '8SbUCzKW9vQ',
            title: 'Guns N Roses - November Rain (Official Karaoke Instrumental)',
            channelTitle: 'Rock Karaoke Classics',
            thumbnailUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=640&q=80',
            duration: '8:57',
            isCurated: true,
          },
          singerName: 'Rian D’Akustik',
          addedAt: Date.now() + 2000,
        },
      ],
      history: [],
      clients: new Map(),
      lastUpdated: Date.now(),
    };
    rooms.set(cleanId, room);
  }
  return room;
}

function broadcastToRoom(room: RoomState, message: any, excludeWs?: WebSocket) {
  const payloadStr = JSON.stringify(message);

  room.clients.forEach((client) => {
    // 1. WebSocket broadcast
    if (client.ws && client.ws !== excludeWs && client.ws.readyState === WebSocket.OPEN) {
      try {
        client.ws.send(payloadStr);
      } catch (err) {
        console.warn('WS broadcast error:', err);
      }
    }

    // 2. SSE broadcast
    if (client.sseRes) {
      try {
        client.sseRes.write(`data: ${payloadStr}\n\n`);
      } catch (err) {
        console.warn('SSE broadcast error:', err);
      }
    }
  });
}

function getRoomClientSummaries(room: RoomState) {
  const list: { id: string; name: string; role: 'master' | 'client' }[] = [];
  room.clients.forEach((c) => {
    list.push({ id: c.id, name: c.name, role: c.role });
  });
  return list;
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  // Support proxies across all Cloud Run regions and CDNs
  app.set('trust proxy', true);

  // Cross-Origin Resource Sharing (CORS) for all regions, origins and devices
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  app.use(express.json());

  // Universal Network & Host Info endpoint for cross-region and all-device barcode connectivity
  app.get('/api/network-info', (req, res) => {
    const proto = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'http';
    const host = (req.headers['x-forwarded-host'] as string) || req.headers.host || `localhost:${PORT}`;
    const detectedUrl = `${proto}://${host}`;

    const networkInterfaces = os.networkInterfaces();
    const localIps: string[] = [];
    for (const name of Object.keys(networkInterfaces)) {
      for (const net of networkInterfaces[name] || []) {
        if (net.family === 'IPv4' && !net.internal) {
          localIps.push(net.address);
        }
      }
    }

    const publicUrl = process.env.APP_URL || detectedUrl;
    const sharedUrl = publicUrl.includes('ais-dev-')
      ? publicUrl.replace('ais-dev-', 'ais-pre-')
      : publicUrl;

    res.json({
      success: true,
      detectedUrl: publicUrl,
      sharedUrl,
      rawDetectedUrl: detectedUrl,
      localIps,
      port: PORT,
      region: process.env.CLOUD_RUN_REGION || process.env.REGION || 'asia-southeast1',
      isCloudRun: !!process.env.K_SERVICE || !!process.env.APP_URL,
    });
  });

  // Public search route without any API key!
  app.get('/api/search', async (req, res) => {
    try {
      const query = (req.query.q as string || '').trim();
      if (!query) {
        return res.status(400).json({ success: false, error: 'Query parameter "q" is required' });
      }

      const r = await ytSearch(query);
      const videos = (r.videos || []).slice(0, 24).map((v) => ({
        id: v.videoId,
        title: v.title,
        channelTitle: v.author?.name || 'YouTube',
        thumbnailUrl: v.thumbnail || v.image || `https://img.youtube.com/vi/${v.videoId}/hqdefault.jpg`,
        duration: v.timestamp || '',
        publishedAt: v.ago || '',
        views: v.views,
        isCurated: false,
      }));

      return res.json({
        success: true,
        source: 'no-api-key-engine',
        query,
        count: videos.length,
        songs: videos,
      });
    } catch (err: any) {
      console.error('Search error in /api/search:', err);
      return res.status(500).json({
        success: false,
        error: err.message || 'Gagal mencari video dari YouTube',
        songs: [],
      });
    }
  });

  // Resolve video info by ID without API key
  app.get('/api/resolve-video', async (req, res) => {
    try {
      const videoId = (req.query.id as string || '').trim();
      if (!videoId) {
        return res.status(400).json({ error: 'Parameter "id" is required' });
      }

      const r = await ytSearch({ videoId });
      if (r) {
        return res.json({
          success: true,
          song: {
            id: r.videoId,
            title: r.title,
            channelTitle: r.author?.name || 'YouTube',
            thumbnailUrl: r.thumbnail || `https://img.youtube.com/vi/${r.videoId}/hqdefault.jpg`,
            duration: r.timestamp || '',
            publishedAt: r.ago || '',
          },
        });
      }

      return res.status(404).json({ error: 'Video tidak ditemukan' });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Shortcut routes so users never get "page not found" on manual URL typing
  app.get(['/client', '/remote', '/hp'], (req, res) => {
    const room = req.query.room ? `&room=${encodeURIComponent(req.query.room as string)}` : '';
    res.redirect(`/?client=1${room}`);
  });

  app.get(['/tv', '/stage', '/panggung'], (req, res) => {
    const room = req.query.room ? `&room=${encodeURIComponent(req.query.room as string)}` : '';
    res.redirect(`/?mode=tv${room}`);
  });

  // --- ROOM STATE & SYNC API FOR ANDROID CLIENTS & MASTER ---

  // Get current room state
  app.get('/api/room/:roomId', (req, res) => {
    const room = getOrCreateRoom(req.params.roomId);
    res.json({
      success: true,
      room: {
        roomId: room.roomId,
        currentSong: room.currentSong,
        isPlaying: room.isPlaying,
        queue: room.queue,
        clientCount: room.clients.size,
        clients: getRoomClientSummaries(room),
        lastUpdated: room.lastUpdated,
      },
    });
  });

  // Master syncs current state to server
  app.post('/api/room/:roomId/sync', (req, res) => {
    const room = getOrCreateRoom(req.params.roomId);
    const { currentSong, isPlaying, queue, history } = req.body;

    if (currentSong !== undefined) room.currentSong = currentSong;
    if (isPlaying !== undefined) room.isPlaying = isPlaying;
    if (Array.isArray(queue)) room.queue = queue;
    if (Array.isArray(history)) room.history = history;
    room.lastUpdated = Date.now();

    // Broadcast state update to all phones/clients
    broadcastToRoom(room, {
      type: 'STATE_UPDATE',
      roomId: room.roomId,
      payload: {
        currentSong: room.currentSong,
        isPlaying: room.isPlaying,
        queue: room.queue,
        clientCount: room.clients.size,
      },
      timestamp: Date.now(),
    });

    res.json({ success: true, clientCount: room.clients.size });
  });

  // Client & Master HTTP heartbeat ping (tracks live connected phones even when WebSockets are blocked)
  app.post('/api/room/:roomId/ping', (req, res) => {
    const room = getOrCreateRoom(req.params.roomId);
    const { clientId, singerName, role } = req.body;
    const id = clientId || `http-${req.ip || 'device'}`;

    const existing = room.clients.get(id);
    const isNew = !existing;
    const clientRecord: ConnectedClient = {
      id,
      name: singerName || existing?.name || (role === 'master' ? 'Layar Utama' : 'Prajurit (HP)'),
      role: role || 'client',
      lastSeen: Date.now(),
      connectedAt: existing?.connectedAt || Date.now(),
    };
    room.clients.set(id, clientRecord);

    // Prune stale HTTP clients that haven't pinged in 20 seconds
    const now = Date.now();
    for (const [cId, client] of room.clients.entries()) {
      if (!client.ws && client.lastSeen && now - client.lastSeen > 20000) {
        room.clients.delete(cId);
      }
    }

    if (isNew) {
      broadcastToRoom(room, {
        type: 'CLIENT_COUNT_UPDATE',
        roomId: room.roomId,
        payload: {
          clientCount: room.clients.size,
          clients: getRoomClientSummaries(room),
          joinedName: clientRecord.name,
        },
      });
    }

    res.json({
      success: true,
      clientCount: room.clients.size,
      room: {
        roomId: room.roomId,
        currentSong: room.currentSong,
        isPlaying: room.isPlaying,
        queue: room.queue,
        lastUpdated: room.lastUpdated,
      },
    });
  });

  // Client adds song to the master queue
  app.post('/api/room/:roomId/queue', (req, res) => {
    const room = getOrCreateRoom(req.params.roomId);
    const { song, singerName, priority } = req.body;

    if (!song || !song.id) {
      return res.status(400).json({ success: false, error: 'Data lagu tidak lengkap' });
    }

    const newItem = {
      queueId: `q-remote-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      song,
      singerName: singerName?.trim() || 'Prajurit (HP)',
      addedAt: Date.now(),
      priority: !!priority,
    };

    if (priority) {
      room.queue.unshift(newItem);
    } else {
      room.queue.push(newItem);
    }

    if (!room.currentSong) {
      room.currentSong = song;
      room.isPlaying = true;
    }
    room.lastUpdated = Date.now();

    // Broadcast ADD_QUEUE_ITEM to Master and all connected devices
    broadcastToRoom(room, {
      type: 'ADD_QUEUE_ITEM',
      roomId: room.roomId,
      payload: {
        item: newItem,
        senderName: newItem.singerName,
      },
      timestamp: Date.now(),
    });

    // Also broadcast STATE_UPDATE to ensure 100% sync
    broadcastToRoom(room, {
      type: 'STATE_UPDATE',
      roomId: room.roomId,
      payload: {
        currentSong: room.currentSong,
        isPlaying: room.isPlaying,
        queue: room.queue,
        clientCount: room.clients.size,
      },
      timestamp: Date.now(),
    });

    res.json({ success: true, item: newItem, queueLength: room.queue.length, currentSong: room.currentSong });
  });

  // Client or master removes a song from queue
  app.post('/api/room/:roomId/remove', (req, res) => {
    const room = getOrCreateRoom(req.params.roomId);
    const { queueId } = req.body;

    if (!queueId) {
      return res.status(400).json({ success: false, error: 'queueId wajib diisi' });
    }

    room.queue = room.queue.filter((q) => q.queueId !== queueId);
    room.lastUpdated = Date.now();

    broadcastToRoom(room, {
      type: 'REMOVE_QUEUE_ITEM',
      roomId: room.roomId,
      payload: { queueId },
      timestamp: Date.now(),
    });

    res.json({ success: true, queue: room.queue });
  });

  // Client reorders queue (move up / down)
  app.post('/api/room/:roomId/reorder', (req, res) => {
    const room = getOrCreateRoom(req.params.roomId);
    const { fromIndex, toIndex, singerName } = req.body;

    if (
      typeof fromIndex === 'number' &&
      typeof toIndex === 'number' &&
      fromIndex >= 0 &&
      fromIndex < room.queue.length &&
      toIndex >= 0 &&
      toIndex < room.queue.length
    ) {
      const [moved] = room.queue.splice(fromIndex, 1);
      room.queue.splice(toIndex, 0, moved);
      room.lastUpdated = Date.now();

      broadcastToRoom(room, {
        type: 'SYNC_QUEUE',
        roomId: room.roomId,
        payload: { queue: room.queue, senderName: singerName || 'HP Client' },
        timestamp: Date.now(),
      });
      return res.json({ success: true, queue: room.queue });
    }
    return res.status(400).json({ success: false, error: 'Index antrean tidak valid' });
  });

  // Client changes song immediately (play now)
  app.post('/api/room/:roomId/play-now', (req, res) => {
    const room = getOrCreateRoom(req.params.roomId);
    const { song, singerName } = req.body;

    if (!song || !song.id) {
      return res.status(400).json({ success: false, error: 'Data lagu tidak valid' });
    }

    room.currentSong = song;
    room.isPlaying = true;
    room.lastUpdated = Date.now();

    broadcastToRoom(room, {
      type: 'PLAY_NOW',
      roomId: room.roomId,
      payload: { song, singerName: singerName || 'Prajurit (HP)' },
      timestamp: Date.now(),
    });

    res.json({ success: true, currentSong: room.currentSong });
  });

  // Client skips to next song
  app.post('/api/room/:roomId/skip', (req, res) => {
    const room = getOrCreateRoom(req.params.roomId);
    const { singerName, nextSong } = req.body;

    if (nextSong && nextSong.id) {
      room.currentSong = nextSong;
      room.isPlaying = true;
      room.queue = room.queue.filter((q) => q.song.id !== nextSong.id);
    } else if (room.queue.length > 0) {
      const nextItem = room.queue.shift();
      if (nextItem) {
        room.currentSong = nextItem.song;
        room.isPlaying = true;
      }
    }
    room.lastUpdated = Date.now();

    broadcastToRoom(room, {
      type: 'SKIP_NEXT',
      roomId: room.roomId,
      payload: { currentSong: room.currentSong, queue: room.queue, senderName: singerName || 'Prajurit (HP)' },
      timestamp: Date.now(),
    });

    broadcastToRoom(room, {
      type: 'STATE_UPDATE',
      roomId: room.roomId,
      payload: {
        currentSong: room.currentSong,
        isPlaying: room.isPlaying,
        queue: room.queue,
        clientCount: room.clients.size,
      },
      timestamp: Date.now(),
    });

    res.json({ success: true, currentSong: room.currentSong, queue: room.queue });
  });

  // Client toggles play / pause on the TV & Tablet
  app.post('/api/room/:roomId/toggle-pause', (req, res) => {
    const room = getOrCreateRoom(req.params.roomId);
    const { senderName, isPlaying } = req.body;
    if (typeof isPlaying === 'boolean') {
      room.isPlaying = isPlaying;
    } else {
      room.isPlaying = !room.isPlaying;
    }
    room.lastUpdated = Date.now();

    broadcastToRoom(room, {
      type: 'TOGGLE_PAUSE',
      roomId: room.roomId,
      payload: { isPlaying: room.isPlaying, senderName: senderName || 'Tablet/HP' },
      timestamp: Date.now(),
    });

    res.json({ success: true, isPlaying: room.isPlaying });
  });

  // Client triggers sound effect reaction on the TV master screen
  app.post('/api/room/:roomId/reaction', (req, res) => {
    const room = getOrCreateRoom(req.params.roomId);
    const { sound, singerName } = req.body;

    broadcastToRoom(room, {
      type: 'PLAY_SOUND_FX',
      roomId: room.roomId,
      payload: {
        sound: sound || 'applause',
        senderName: singerName || 'Prajurit (HP)',
      },
      timestamp: Date.now(),
    });

    res.json({ success: true });
  });

  // Server-Sent Events (SSE) fallback stream
  app.get('/api/room/:roomId/events', (req, res) => {
    const roomId = req.params.roomId;
    const room = getOrCreateRoom(roomId);
    const clientId = `sse-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const clientName = (req.query.name as string) || 'HP Client';
    const role = (req.query.role as 'master' | 'client') || 'client';

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });
    res.write('\n');

    const connectedClient: ConnectedClient = {
      id: clientId,
      name: clientName,
      role,
      sseRes: res,
      connectedAt: Date.now(),
    };
    room.clients.set(clientId, connectedClient);

    // Send initial snapshot
    res.write(
      `data: ${JSON.stringify({
        type: 'INIT_STATE',
        roomId: room.roomId,
        payload: {
          currentSong: room.currentSong,
          isPlaying: room.isPlaying,
          queue: room.queue,
          clientCount: room.clients.size,
          clients: getRoomClientSummaries(room),
        },
        timestamp: Date.now(),
      })}\n\n`
    );

    // Notify room of new device
    broadcastToRoom(room, {
      type: 'CLIENT_COUNT_UPDATE',
      roomId: room.roomId,
      payload: {
        clientCount: room.clients.size,
        clients: getRoomClientSummaries(room),
        joinedName: clientName,
      },
      timestamp: Date.now(),
    });

    req.on('close', () => {
      room.clients.delete(clientId);
      broadcastToRoom(room, {
        type: 'CLIENT_COUNT_UPDATE',
        roomId: room.roomId,
        payload: {
          clientCount: room.clients.size,
          clients: getRoomClientSummaries(room),
        },
        timestamp: Date.now(),
      });
    });
  });

  // Vite middleware in dev or static files in prod
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  // Create unified HTTP server
  const server = http.createServer(app);

  // WebSocket Server attached to the same HTTP server
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws, req) => {
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    const roomId = (url.searchParams.get('room') || 'DEFAULT-ROOM').trim().toUpperCase();
    const role = (url.searchParams.get('role') as 'master' | 'client') || 'client';
    const singerName = url.searchParams.get('singer') || (role === 'master' ? 'Layar Utama' : 'Prajurit (HP)');

    const room = getOrCreateRoom(roomId);
    const clientId = `ws-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    const clientRecord: ConnectedClient = {
      id: clientId,
      name: singerName,
      role,
      ws,
      connectedAt: Date.now(),
    };
    room.clients.set(clientId, clientRecord);

    // Send initial snapshot to newly connected device
    ws.send(
      JSON.stringify({
        type: 'INIT_STATE',
        roomId: room.roomId,
        payload: {
          currentSong: room.currentSong,
          isPlaying: room.isPlaying,
          queue: room.queue,
          clientCount: room.clients.size,
          clients: getRoomClientSummaries(room),
        },
        timestamp: Date.now(),
      })
    );

    // Broadcast client join update
    broadcastToRoom(room, {
      type: 'CLIENT_COUNT_UPDATE',
      roomId: room.roomId,
      payload: {
        clientCount: room.clients.size,
        clients: getRoomClientSummaries(room),
        joinedName: singerName,
      },
      timestamp: Date.now(),
    });

    ws.on('message', (data) => {
      try {
        const msg = JSON.parse(data.toString());
        if (!msg || !msg.type) return;

        switch (msg.type) {
          case 'SYNC_STATE': {
            if (msg.payload) {
              if (msg.payload.currentSong !== undefined) room.currentSong = msg.payload.currentSong;
              if (msg.payload.isPlaying !== undefined) room.isPlaying = msg.payload.isPlaying;
              if (Array.isArray(msg.payload.queue)) room.queue = msg.payload.queue;
              room.lastUpdated = Date.now();

              broadcastToRoom(
                room,
                {
                  type: 'STATE_UPDATE',
                  roomId: room.roomId,
                  payload: {
                    currentSong: room.currentSong,
                    isPlaying: room.isPlaying,
                    queue: room.queue,
                    clientCount: room.clients.size,
                  },
                  timestamp: Date.now(),
                },
                ws
              );
            }
            break;
          }

          case 'ADD_QUEUE_ITEM': {
            const { song, singerName: addedBy, priority } = msg.payload || {};
            if (song && song.id) {
              const item = {
                queueId: `q-ws-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                song,
                singerName: addedBy || singerName || 'Prajurit (HP)',
                addedAt: Date.now(),
                priority: !!priority,
              };

              if (priority) {
                room.queue.unshift(item);
              } else {
                room.queue.push(item);
              }
              room.lastUpdated = Date.now();

              // Broadcast to everyone (including master)
              broadcastToRoom(room, {
                type: 'ADD_QUEUE_ITEM',
                roomId: room.roomId,
                payload: {
                  item,
                  senderName: item.singerName,
                },
                timestamp: Date.now(),
              });
            }
            break;
          }

          case 'REMOVE_QUEUE_ITEM': {
            const queueId = msg.payload?.queueId;
            if (queueId) {
              room.queue = room.queue.filter((q) => q.queueId !== queueId);
              room.lastUpdated = Date.now();
              broadcastToRoom(room, {
                type: 'REMOVE_QUEUE_ITEM',
                roomId: room.roomId,
                payload: { queueId },
                timestamp: Date.now(),
              });
            }
            break;
          }

          case 'MOVE_QUEUE_ITEM': {
            const { fromIndex, toIndex } = msg.payload || {};
            if (
              typeof fromIndex === 'number' &&
              typeof toIndex === 'number' &&
              fromIndex >= 0 &&
              fromIndex < room.queue.length &&
              toIndex >= 0 &&
              toIndex < room.queue.length
            ) {
              const [moved] = room.queue.splice(fromIndex, 1);
              room.queue.splice(toIndex, 0, moved);
              room.lastUpdated = Date.now();

              broadcastToRoom(room, {
                type: 'SYNC_QUEUE',
                roomId: room.roomId,
                payload: { queue: room.queue, senderName: singerName },
                timestamp: Date.now(),
              });
            }
            break;
          }

          case 'PLAY_NOW': {
            const song = msg.payload?.song;
            const singer = msg.payload?.singerName || singerName;
            if (song && song.id) {
              room.currentSong = song;
              room.isPlaying = true;
              room.lastUpdated = Date.now();

              broadcastToRoom(room, {
                type: 'PLAY_NOW',
                roomId: room.roomId,
                payload: { song, singerName: singer },
                timestamp: Date.now(),
              });
            }
            break;
          }

          case 'PLAY_SOUND_FX': {
            broadcastToRoom(room, {
              type: 'PLAY_SOUND_FX',
              roomId: room.roomId,
              payload: {
                sound: msg.payload?.sound || 'applause',
                senderName: singerName,
              },
              timestamp: Date.now(),
            });
            break;
          }

          case 'SKIP_NEXT': {
            broadcastToRoom(room, {
              type: 'SKIP_NEXT',
              roomId: room.roomId,
              payload: { senderName: singerName },
              timestamp: Date.now(),
            });
            break;
          }

          case 'TOGGLE_PAUSE': {
            if (typeof msg.payload?.isPlaying === 'boolean') {
              room.isPlaying = msg.payload.isPlaying;
            } else {
              room.isPlaying = !room.isPlaying;
            }
            room.lastUpdated = Date.now();
            broadcastToRoom(room, {
              type: 'TOGGLE_PAUSE',
              roomId: room.roomId,
              payload: { isPlaying: room.isPlaying, senderName: singerName },
              timestamp: Date.now(),
            });
            break;
          }
        }
      } catch (err) {
        console.warn('WS message error:', err);
      }
    });

    ws.on('close', () => {
      room.clients.delete(clientId);
      broadcastToRoom(room, {
        type: 'CLIENT_COUNT_UPDATE',
        roomId: room.roomId,
        payload: {
          clientCount: room.clients.size,
          clients: getRoomClientSummaries(room),
        },
        timestamp: Date.now(),
      });
    });

    ws.on('error', (err) => {
      console.warn('WS connection error:', err);
    });
  });

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server karaoke aktif di port ${PORT} (WebSocket + REST + Scraping).`);
  });
}

startServer();

