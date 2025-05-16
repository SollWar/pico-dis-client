export interface Message {
  id: string
  room_id: string
  user_id: string
  content: string
  created_at: string
}

export const messages: Message[] = [
  {
    id: '1',
    room_id: '1',
    user_id: '1',
    content:
      'Я работаю удаленно. Фрилансер, так сказать. Сейчас как раз пытаюсь добить один проект.',
    created_at: '12:25:1',
  },
  {
    id: '1',
    room_id: '1',
    user_id: '1',
    content:
      'Я работаю удаленно. Фрилансер, так сказать. Сейчас как раз пытаюсь добить один проект.',
    created_at: '12:25:2',
  },
  {
    id: '1',
    room_id: '1',
    user_id: '1',
    content:
      'Я работаю удаленно. Фрилансер, так сказать. Сейчас как раз пытаюсь добить один проект.',
    created_at: '12:25:45',
  },
  {
    id: '1',
    room_id: '1',
    user_id: '1',
    content:
      'Я работаю удаленно. Фрилансер, так сказать. Сейчас как раз пытаюсь добить один проект.',
    created_at: '12:25:45',
  },
  {
    id: '1',
    room_id: '1',
    user_id: '1',
    content:
      'Я работаю удаленно. Фрилансер, так сказать. Сейчас как раз пытаюсь добить один проект.',
    created_at: '12:25:45',
  },
  {
    id: '2',
    room_id: '1',
    user_id: '1',
    content:
      'Да, поначалу сложно, но потом втягиваешься. Это как погружение в другой мир.',
    created_at: '12:25:45',
  },
  {
    id: '3',
    room_id: '1',
    user_id: '2',
    content:
      'О, классика! Я пытался осилить ее несколько раз, но все время откладывал. Слишком много имен и событий.',
    created_at: '12:25:45',
  },
  {
    id: '4',
    room_id: '1',
    user_id: '2',
    content:
      'Есть свои плюсы и минусы. Но в целом, да, свобода выбора - это здорово. Ладно, не буду вас отвлекать от чтения. Приятного вам отдыха!',
    created_at: '12:25:45',
  },
].reverse()

export const userNameForId = (id: string) => {
  if (id === '1') return 'Z3RG'
  else return 'PATRON'
}

// CREATE TABLE messages (
//   id           TEXT        PRIMARY KEY,
//   room_id      TEXT        NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
//   user_id      TEXT        NOT NULL REFERENCES users(id) ON DELETE SET NULL,
//   content      TEXT        NOT NULL,
//   created_at   TIMESTAMP   NOT NULL DEFAULT now(),
//   -- опционально: какие-то метаданные, например тип (text/image и т.п.)
//   -- type        TEXT        NOT NULL DEFAULT 'text'
// );
