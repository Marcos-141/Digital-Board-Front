export type RoleName = 'STUDENT' | 'TEACHER' | 'ADMIN'

// ---- Requests (lo que se ENVÍA) ----
export interface UserRequest {
  nombre: string
  email: string
  password: string
}

export interface TeacherRegistrationRequest extends UserRequest {
  invitationCode: string
}

export interface TopicRequest {
  topicName: string
  topicDescription: string
}

export interface PostRequest {
  title: string
  description: string
  image?: string | null
  userId: number
  topicId: number
}

export interface CommentRequest {
  content: string
  image?: string | null
  postId: number
  userId: number
}

// ---- Responses (lo que se RECIBE) ----
export interface UserResponse {
  userId: number
  nombre: string
  email: string
  role: RoleName | null
  createdAt: string | null
}

export interface TopicResponse {
  id: number
  topicName: string
  description: string
}

export interface PostResponse {
  postId: number
  title: string
  description: string
  image: string | null
  userId: number | null
  userName: string | null
  topicId: number | null
  topicName: string | null
  createdAt: string | null
  updateAt: string | null
}

export interface CommentResponse {
  commentId: number
  content: string
  image: string | null
  postId: number | null
  userId: number | null
  userName: string | null
  createdAt: string | null
  updatedAt: string | null
}

// ---- Error estándar del backend ----
export interface ApiErrorBody {
  timestamp: string
  status: number
  error: string
  message: string
  path: string
  validationErrors?: Record<string, string>
}
