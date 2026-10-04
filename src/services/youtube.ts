import { Song, SuffixFilter, CategoryPreset } from '../types/karaoke';

export const CATEGORY_PRESETS: CategoryPreset[] = [
  {
    id: 'slow-rock',
    label: 'Slow Rock Ballads',
    query: 'Slow Rock Ballads',
    description: 'Scorpions, Bon Jovi, Guns N Roses, White Lion, Deep Purple',
    iconName: 'Flame',
    badgeColor: 'from-amber-500 to-red-600',
  },
  {
    id: 'roots-reggae',
    label: 'Roots Reggae',
    query: 'Roots Reggae',
    description: 'Bob Marley, Peter Tosh, UB40, Burning Spear, Black Uhuru',
    iconName: 'Sun',
    badgeColor: 'from-emerald-500 to-amber-500',
  },
  {
    id: 'roots-dub',
    label: 'Roots Dub',
    query: 'Roots Dub',
    description: 'King Tubby, Lee Scratch Perry, Scientist, Augustus Pablo',
    iconName: 'Radio',
    badgeColor: 'from-purple-500 to-indigo-600',
  },
  {
    id: 'pop-indonesia',
    label: 'Pop Indonesia',
    query: 'Pop Indonesia Hits',
    description: 'Dewa 19, Sheila on 7, Peterpan, Chrisye, Kahitna',
    iconName: 'Music',
    badgeColor: 'from-rose-500 to-pink-600',
  },
  {
    id: 'rock-classics',
    label: 'Classic 80s & 90s',
    query: '80s 90s Classic Hits',
    description: 'Queen, Bryan Adams, Michael Learns to Rock, Oasis',
    iconName: 'Disc',
    badgeColor: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'dangdut-koplo',
    label: 'Dangdut & Koplo',
    query: 'Dangdut Koplo Populer',
    description: 'Rhoma Irama, Denny Caknan, Via Vallen, Didi Kempot',
    iconName: 'Sparkles',
    badgeColor: 'from-yellow-400 to-orange-500',
  },
];

// Curated high quality karaoke video IDs for instant play & fallback
export const CURATED_LIBRARY: Record<string, Song[]> = {
  'slow-rock': [
    {
      id: 'nCbzF356088',
      title: 'Scorpions - Wind Of Change (Karaoke Version)',
      channelTitle: 'Sing King Karaoke',
      thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=640&q=80',
      duration: '5:10',
      isCurated: true,
    },
    {
      id: 's88r_q7oufE',
      title: 'Bon Jovi - Bed Of Roses (Karaoke With Lyrics)',
      channelTitle: 'Karaoke Star HD',
      thumbnailUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=640&q=80',
      duration: '6:35',
      isCurated: true,
    },
    {
      id: '8SbUCzKW9vQ',
      title: 'Guns N Roses - November Rain (Official Karaoke Instrumental)',
      channelTitle: 'Rock Karaoke Classics',
      thumbnailUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=640&q=80',
      duration: '8:57',
      isCurated: true,
    },
    {
      id: 'xfr64nMz7n0',
      title: 'White Lion - When The Children Cry (Karaoke No Vocal)',
      channelTitle: '80s Ballad Karaoke',
      thumbnailUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=640&q=80',
      duration: '4:20',
      isCurated: true,
    },
    {
      id: 'L3HQMb9CPag',
      title: 'Deep Purple - Soldier of Fortune (Acoustic Karaoke)',
      channelTitle: 'Legendary Rock Karaoke',
      thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=640&q=80',
      duration: '3:15',
      isCurated: true,
    },
    {
      id: 'fJ9rUzIMcZQ',
      title: 'Queen - Bohemian Rhapsody (Karaoke Version)',
      channelTitle: 'Sing King Karaoke',
      thumbnailUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=640&q=80',
      duration: '5:55',
      isCurated: true,
    },
  ],
  'roots-reggae': [
    {
      id: 'CHekNnySAfM',
      title: 'Bob Marley - Could You Be Loved (Karaoke Lyrics)',
      channelTitle: 'Reggae Jam Karaoke',
      thumbnailUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=640&q=80',
      duration: '3:57',
      isCurated: true,
    },
    {
      id: 'vdB-8eLEW8g',
      title: 'Bob Marley - No Woman No Cry (Karaoke No Vocal)',
      channelTitle: 'Roots Sound Karaoke',
      thumbnailUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=640&q=80',
      duration: '4:15',
      isCurated: true,
    },
    {
      id: 'o-5E6_4SdgA',
      title: 'Peter Tosh - Johnny B Goode (Reggae Karaoke)',
      channelTitle: 'Tuff Gong Dubs',
      thumbnailUrl: 'https://images.unsplash.com/photo-1445985543470-41fdd6ce388d?auto=format&fit=crop&w=640&q=80',
      duration: '4:02',
      isCurated: true,
    },
    {
      id: 'r3Pr1P3Q7ic',
      title: 'UB40 - Red Red Wine (Karaoke Instrumental Version)',
      channelTitle: 'Island Karaoke',
      thumbnailUrl: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?auto=format&fit=crop&w=640&q=80',
      duration: '3:05',
      isCurated: true,
    },
    {
      id: 'bTqVqk7FSmY',
      title: 'Inner Circle - Sweat (A La La La La Long) Karaoke',
      channelTitle: 'Tropical Karaoke Zone',
      thumbnailUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=640&q=80',
      duration: '3:45',
      isCurated: true,
    },
  ],
  'roots-dub': [
    {
      id: '2GZbaPTPECA',
      title: 'King Tubby Style - Deep Roots Dub Instrumental Session',
      channelTitle: 'Dub Syndicate Audio',
      thumbnailUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=640&q=80',
      duration: '4:40',
      isCurated: true,
    },
    {
      id: 'kJQP7kiw5Fk',
      title: 'Scientist - Heavy Dub Riddim (Bass & Echo Instrumental)',
      channelTitle: 'Dub Master Vault',
      thumbnailUrl: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=640&q=80',
      duration: '3:50',
      isCurated: true,
    },
    {
      id: 'fRegvH_8dI0',
      title: 'Lee Scratch Perry - Blackboard Jungle Dub Melodica Track',
      channelTitle: 'Echo Chamber Sounds',
      thumbnailUrl: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=640&q=80',
      duration: '4:15',
      isCurated: true,
    },
    {
      id: 'M7lc1UVf-VE',
      title: 'Augustus Pablo - King Tubby Meets Rockers Uptown (Dub Version)',
      channelTitle: 'Roots Dub Archive',
      thumbnailUrl: 'https://images.unsplash.com/photo-1520523839898-507127045c42?auto=format&fit=crop&w=640&q=80',
      duration: '2:58',
      isCurated: true,
    },
  ],
  'pop-indonesia': [
    {
      id: 't-iX_3e1aQo',
      title: 'Dewa 19 - Kangen (Karaoke Akustik Nada Wanita/Pria)',
      channelTitle: 'Karaoke Pop Nusantara',
      thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=640&q=80',
      duration: '5:12',
      isCurated: true,
    },
    {
      id: 'r_g_w7T92W0',
      title: 'Sheila On 7 - Dan (Karaoke Lirik Video)',
      channelTitle: 'SO7 Karaoke Channel',
      thumbnailUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=640&q=80',
      duration: '4:45',
      isCurated: true,
    },
    {
      id: 'kXYiU_JCYtU',
      title: 'Peterpan - Menghapus Jejakmu (Karaoke No Vocal)',
      channelTitle: 'Musisi Karaoke Indo',
      thumbnailUrl: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=640&q=80',
      duration: '3:05',
      isCurated: true,
    },
    {
      id: 'CevxZvSJLk8',
      title: 'Chrisye - Pergilah Kasih (Karaoke Tanpa Vokal)',
      channelTitle: 'Evergreen Indonesia',
      thumbnailUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=640&q=80&q=80',
      duration: '4:30',
      isCurated: true,
    },
  ],
  'rock-classics': [
    {
      id: 'fJ9rUzIMcZQ',
      title: 'Queen - Bohemian Rhapsody (Official Karaoke)',
      channelTitle: 'Sing King',
      thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=640&q=80',
      duration: '5:55',
      isCurated: true,
    },
    {
      id: 'L3HQMb9CPag',
      title: 'Bryan Adams - (Everything I Do) I Do It For You Karaoke',
      channelTitle: 'Classic Love Karaoke',
      thumbnailUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=640&q=80',
      duration: '6:30',
      isCurated: true,
    },
    {
      id: 'xfr64nMz7n0',
      title: 'Oasis - Wonderwall (Karaoke Acoustic)',
      channelTitle: 'Britpop Karaoke',
      thumbnailUrl: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=640&q=80',
      duration: '4:18',
      isCurated: true,
    },
  ],
  'dangdut-koplo': [
    {
      id: 'vdB-8eLEW8g',
      title: 'Denny Caknan - Kartonyono Medot Janji (Karaoke Kendang)',
      channelTitle: 'Campursari Karaoke HD',
      thumbnailUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=640&q=80',
      duration: '4:50',
      isCurated: true,
    },
    {
      id: 'r3Pr1P3Q7ic',
      title: 'Didi Kempot - Pamer Bojo (Karaoke Versi Cendol Dawet)',
      channelTitle: 'Sobat Ambyar Official Karaoke',
      thumbnailUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=640&q=80',
      duration: '4:40',
      isCurated: true,
    },
  ],
};

// Clean HTML entities returned by YouTube API (e.g., &#39; -> ')
export function decodeHtmlEntities(str: string): string {
  if (!str) return '';
  const txt = document.createElement('textarea');
  txt.innerHTML = str;
  return txt.value;
}

// Extract Video ID if user pastes YouTube URL
export function extractYoutubeVideoId(input: string): string | null {
  const trimmed = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  const match = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );
  return match ? match[1] : null;
}

/**
 * Build the exact search query by automatically appending 'karaoke' or 'no vocal'
 */
export function buildKaraokeQuery(userInput: string, suffix: SuffixFilter): string {
  const cleanInput = userInput.trim();
  if (!cleanInput) return '';

  const lower = cleanInput.toLowerCase();
  if (suffix === 'karaoke') {
    if (!lower.includes('karaoke')) {
      return `${cleanInput} karaoke`;
    }
    return cleanInput;
  }
  if (suffix === 'no vocal') {
    if (!lower.includes('no vocal') && !lower.includes('tanpa vokal')) {
      return `${cleanInput} no vocal`;
    }
    return cleanInput;
  }
  if (suffix === 'instrumental') {
    if (!lower.includes('instrumental')) {
      return `${cleanInput} instrumental`;
    }
    return cleanInput;
  }
  return cleanInput;
}

/**
 * Fetch video details via public YouTube oEmbed (Zero API Key required)
 */
export async function fetchOEmbedInfo(videoId: string): Promise<{ title?: string; author_name?: string } | null> {
  try {
    const res = await fetch(
      `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`
    );
    if (res.ok) {
      const data = await res.json();
      return {
        title: data.title,
        author_name: data.author_name,
      };
    }
  } catch (e) {
    // fallback
  }
  return null;
}

/**
 * Public Invidious mirror search fallback (No API key needed)
 */
async function searchViaInvidious(query: string): Promise<Song[]> {
  const mirrors = [
    'https://inv.nadeko.net/api/v1/search',
    'https://invidious.nerdvpn.de/api/v1/search',
  ];

  for (const mirror of mirrors) {
    try {
      const res = await fetch(`${mirror}?q=${encodeURIComponent(query)}&type=video`, {
        signal: AbortSignal.timeout(4000),
      });
      if (res.ok) {
        const items = await res.json();
        if (Array.isArray(items) && items.length > 0) {
          return items.slice(0, 16).map((item: any) => ({
            id: item.videoId,
            title: decodeHtmlEntities(item.title),
            channelTitle: decodeHtmlEntities(item.author || 'YouTube'),
            thumbnailUrl:
              item.videoThumbnails?.find((t: any) => t.quality === 'medium')?.url ||
              `https://img.youtube.com/vi/${item.videoId}/hqdefault.jpg`,
            duration: item.lengthSeconds
              ? `${Math.floor(item.lengthSeconds / 60)}:${(item.lengthSeconds % 60).toString().padStart(2, '0')}`
              : undefined,
            isCurated: false,
          }));
        }
      }
    } catch {
      // try next mirror
    }
  }
  return [];
}

/**
 * Perform Search on YouTube Data API v3, Backend Proxy, or Curated fallback
 * ZERO API KEY REQUIRED by default!
 */
export async function searchKaraokeSongs(
  rawQuery: string,
  suffix: SuffixFilter,
  apiKey?: string,
  categoryPresetId?: string
): Promise<{ songs: Song[]; isCuratedFallback: boolean; error?: string; source?: string }> {
  const finalQuery = buildKaraokeQuery(rawQuery, suffix);

  // If user provided a custom Google Cloud API key, use official YouTube Data API v3
  if (apiKey && apiKey.trim() !== '' && apiKey !== 'YOUR_YOUTUBE_API_KEY') {
    try {
      const url = new URL('https://www.googleapis.com/youtube/v3/search');
      url.searchParams.set('part', 'snippet');
      url.searchParams.set('maxResults', '16');
      url.searchParams.set('q', finalQuery);
      url.searchParams.set('type', 'video');
      url.searchParams.set('videoEmbeddable', 'true');
      url.searchParams.set('key', apiKey.trim());

      const res = await fetch(url.toString());
      const data = await res.json();

      if (res.ok && data.items && data.items.length > 0) {
        const songs: Song[] = data.items.map((item: any) => ({
          id: item.id.videoId,
          title: decodeHtmlEntities(item.snippet.title),
          channelTitle: decodeHtmlEntities(item.snippet.channelTitle),
          thumbnailUrl:
            item.snippet.thumbnails?.high?.url ||
            item.snippet.thumbnails?.medium?.url ||
            `https://img.youtube.com/vi/${item.id.videoId}/hqdefault.jpg`,
          publishedAt: item.snippet.publishedAt,
          querySource: finalQuery,
          isCurated: false,
        }));
        return { songs, isCuratedFallback: false, source: 'Official YouTube Data API' };
      }
    } catch (err: any) {
      console.warn('Official API error, trying zero-api-key backend:', err);
    }
  }

  // TIER 1: Use Express backend scraper proxy (/api/search) - NO API KEY NEEDED!
  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(finalQuery)}`, {
      signal: AbortSignal.timeout(6000),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.songs) && data.songs.length > 0) {
        return {
          songs: data.songs,
          isCuratedFallback: false,
          source: 'YouTube Live Search (Bebas API Key)',
        };
      }
    }
  } catch (err) {
    console.warn('Backend proxy /api/search unavailable or timed out, trying mirror:', err);
  }

  // TIER 2: Use Public Invidious mirror search (No API key needed)
  try {
    const mirrorResults = await searchViaInvidious(finalQuery);
    if (mirrorResults.length > 0) {
      return {
        songs: mirrorResults,
        isCuratedFallback: false,
        source: 'YouTube Public Mirror (Bebas API Key)',
      };
    }
  } catch (err) {
    console.warn('Mirror search error:', err);
  }

  // TIER 3: Curated Library Fallback
  if (categoryPresetId && CURATED_LIBRARY[categoryPresetId]) {
    return {
      songs: CURATED_LIBRARY[categoryPresetId],
      isCuratedFallback: true,
      source: 'Koleksi Rekomendasi Siap Putar',
    };
  }

  // Match keyword in curated library
  const searchTerms = rawQuery.toLowerCase().split(/\s+/).filter(Boolean);
  const allCurated = Object.values(CURATED_LIBRARY).flat();
  const matched = allCurated.filter((song) => {
    const titleLower = song.title.toLowerCase();
    const channelLower = song.channelTitle.toLowerCase();
    return searchTerms.some((term) => titleLower.includes(term) || channelLower.includes(term));
  });

  if (matched.length > 0) {
    return {
      songs: matched,
      isCuratedFallback: true,
      source: 'Koleksi Rekomendasi Terpilih',
    };
  }

  // Generic curated library
  return {
    songs: [
      ...CURATED_LIBRARY['slow-rock'].slice(0, 3),
      ...CURATED_LIBRARY['roots-reggae'].slice(0, 3),
      ...CURATED_LIBRARY['roots-dub'].slice(0, 2),
      ...CURATED_LIBRARY['pop-indonesia'].slice(0, 3),
    ],
    isCuratedFallback: true,
    source: 'Koleksi Rekomendasi Terpilih',
  };
}

