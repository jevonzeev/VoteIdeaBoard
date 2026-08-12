export interface User {
  id: number;
  username: string;
}

export interface Idea {
  id: number;
  title: string;
  description: string;
  created_at: string;
  created_by_username?: string;
  vote_count: number;
  user_has_voted: boolean;
  is_temp?: boolean;
}

export interface VoteResponse {
  idea_id: number;
  user_has_voted: boolean;
}
