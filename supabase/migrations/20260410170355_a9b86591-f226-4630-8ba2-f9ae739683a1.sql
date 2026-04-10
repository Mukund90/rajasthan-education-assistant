
CREATE TABLE public.colleges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('engineering', 'polytechnic')),
  city TEXT NOT NULL,
  district TEXT NOT NULL,
  established INTEGER,
  website TEXT,
  affiliation TEXT,
  branches JSONB NOT NULL DEFAULT '[]',
  fees JSONB NOT NULL DEFAULT '{}',
  cutoffs JSONB NOT NULL DEFAULT '{}',
  placements JSONB NOT NULL DEFAULT '{}',
  hostel JSONB NOT NULL DEFAULT '{}',
  contact JSONB NOT NULL DEFAULT '{}',
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.scholarships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  eligibility TEXT,
  amount TEXT,
  deadline TEXT,
  how_to_apply TEXT,
  website TEXT,
  category TEXT CHECK (category IN ('merit', 'need', 'sc_st', 'obc', 'minority', 'other')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.chat_queries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  query TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_queries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Colleges are publicly readable" ON public.colleges FOR SELECT USING (true);
CREATE POLICY "Scholarships are publicly readable" ON public.scholarships FOR SELECT USING (true);
CREATE POLICY "Anyone can log queries" ON public.chat_queries FOR INSERT WITH CHECK (true);
CREATE POLICY "Chat queries readable by authenticated" ON public.chat_queries FOR SELECT TO authenticated USING (true);

CREATE INDEX idx_colleges_type ON public.colleges(type);
CREATE INDEX idx_colleges_district ON public.colleges(district);
CREATE INDEX idx_chat_queries_category ON public.chat_queries(category);
CREATE INDEX idx_chat_queries_created ON public.chat_queries(created_at);
