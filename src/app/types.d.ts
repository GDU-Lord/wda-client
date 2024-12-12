interface gridEntry {
  id: string;
  tile_cover: string;
  title: string;
  short_description: string;
  date: string;
  type: 'event' | 'article';
}

interface shortEvent {
  type: 'event';
  id: number;
  documentId: string;
  title: string;
  date: string;
  short_description: string;
  type: string;
  tile_cover: {
    url: string;
  }
}

interface event {
  id: number;
  documentId: string;
  title: string;
  date: string;
  short_description: string;
  type: string;
  tile_cover: {
    url: string;
  }
  description: any;
  end_date: string;
}

interface shortArticle {
  type: 'article';
  id: number;
  documentId: string;
  title: string;
  short_text: string;
  publishedAt: string;
  tile_cover: {
    url: string;
  }
}

interface article {
  id: number;
  documentId: string;
  title: string;
  text: string;
}

type contact =  ['link' | 'email' | 'phone' | 'text', string];