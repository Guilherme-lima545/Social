'use server';
import { Getcookies, Setcookies } from '@/actions/cookie';
import { uploadToCloudinary } from '@/utils/Cloud';
import { error } from 'console';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

type Coment = {
  id: number;
  comment_ID: number;
  comment_content: string;
  comment_author: string;
};

export type Photo = {
  id: number;
  author: string;
  title: string;
  date: Date;
  src: string;
  likes: number;
  idade: number;
  descricao: string;
  acessos: number;
  total_comments: number;
  user_id: number;
};

export type Video = {
  id: number;
  user_id: number,
  title: string;
  media_type: string;
  excerpt: string;
  author: string;
  date: Date;
  video: string;
  thumbnail: string;
  likes: number;
  comments?: Coment[];
  commentsCount: number;
  acessos: number
};


interface PHOTOGETparams {
  page: number;
  total: number;
  user?: number;
}

type Usuario = {
  username: string;
  password: string | number;
  email: string;
};

type UserLogin = {
  username: string;
  password: string | number;
};

type userData = {
  id: number;
  nome: string;
  avatar_url: string;
  roles: string;
};

type UploadPhoto = {
  nome: string;
  idade: number;
  legenda: string;
  photo: File;
};


type PhotoItem = {
  id: number;
  user_id: number;
  acessos: number;
  likes: number;
  idade: number;
  author: string;
  src: string;
  title: string;
  descricao: string;
}

type PhotoResponse = {
  comments: Coment[];
  photo: PhotoItem;
}

// CLOUDNARY //

async function uploadCloudinary(file: File) {
  const data = new FormData();

  data.append("file", file);
  data.append("upload_preset", "Video_social");



  const response = await fetch(
    "https://api.cloudinary.com/v1_1/dew1exsw8/video/upload",
    {
      method: "POST",
      headers: {
       Accept: 'application/json, text/plain, */*',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
      Referer: 'https://api05.byethost3.com/',
      },
      body: data,
    }
  );


  const json = await response.json();
  

  return { 
  secure_url: json.secure_url,
  public_id: json.public_id,
};
}

export async function PHOTOGET({
  page,
  total,
  user,
}: PHOTOGETparams): Promise<Photo[]> {


  if (user == null) {
    return [];
  }


  const response = await fetch(
    `https://api05.byethost3.com/wp-json/api/photo/?_page=${page}&_total=${total}&_user=${user}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
        Referer: 'https://api05.byethost3.com/',
      },
      cache: 'no-store',
    },
  );

  const contentType = response.headers.get('content-type');

  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();

    console.error('API retornou HTML em vez de JSON:', text);

    return [];
  }

  const data = (await response.json()) as Photo[];

  return data;
}

export async function PHOTOGETUSER(userId: string): Promise<PhotoResponse[]> {
  const response = await fetch(
    `https://api05.byethost3.com/wp-json/api/photo/${userId}`,
    { 
      method: 'GET',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
        Referer: 'https://api05.byethost3.com/',
      },
      cache: 'no-store',
    },
  );

  const data = await response.json();

  return Array.isArray(data) ? data : [data];;
}

export async function PHOTO_DELETE({ id }: { id: number }) {
  const token = await Getcookies('token')

  const response = await fetch(
    `https://api05.byethost3.com/wp-json/api/photo/${id}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token.value,
         Accept: 'application/json, text/plain, */*',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
        Referer: 'https://api05.byethost3.com/',
      }
    }
  );


  const data = await response.json();


  revalidatePath(`/photo/${id}`)

  return data;
}

export async function LOGIN(formData: FormData) {
  const user: UserLogin = {
    username: formData.get('usuario') as string,
    password: formData.get('senha') as string,
  };

   const response = await fetch(
    `https://api05.byethost3.com/wp-json/jwt-auth/v1/token`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/plain, */*',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
        Referer: 'https://api05.byethost3.com/',
      },
      body: JSON.stringify(user),
    },
  );

  const data = await response.json();


  if (response.ok) {
    const token = data.token;
    await Setcookies('token', token);
    revalidatePath('/login');
    redirect(`/perfil/${user.username}`);
  }


  return {
    ok: response.ok,
    data,
  };
}

export async function CREATELOGIN(formData: FormData) {
  const usuario: Usuario = {
    username: formData.get('username') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const response = await fetch(`https://api05.byethost3.com/wp-json/api/user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/plain, */*',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
      Referer: 'https://api05.byethost3.com/',
    },
    body: JSON.stringify(usuario),
  });

  const data = await response.json();

   return data
}

export async function USER_GET(username: string) {
  const token = await Getcookies("token");

  const response = await fetch(
    `https://api05.byethost3.com/wp-json/api/user?username=${username}`,
    {
      headers: {
        Authorization: 'Bearer ' + token.value,
        Accept: 'application/json, text/plain, */*',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
        Referer: 'https://api05.byethost3.com/',
      },
    },
  );


  return (await response.json()) as userData;
}

export async function UPLOADAVATAR(formdata: FormData) {
  const file = formdata.get('avatar') as File;
  if (!file) return;

  const upload = await uploadToCloudinary(file);
  const avatarURL = upload.secure_url;

  const token = (await cookies()).get('token')?.value;
  if (!token) {
    return;
  }

  const bodydata = new FormData();
  bodydata.append('avatar_url', avatarURL);

  const wpRes = await fetch('https://api05.byethost3.com/wp-json/api/user', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/json, text/plain, */*',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
      Referer: 'https://api05.byethost3.com/',
    },
    body: bodydata,
  });




  return { secure_url: avatarURL };
}

export async function USERGETONLINE() {
  const r = await fetch('https://api05.byethost3.com/wp-json/api/online', {
    headers: {
      Accept: 'application/json, text/plain, */*',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
      Referer: 'https://api05.byethost3.com/',
    },
    cache: 'no-store',
  });

  const data = await r.json();

  return data;
}

export default async function UPLOADPHOTO(formData: FormData) {
  const photodados: UploadPhoto = {
    nome: formData.get('nome') as string,
    idade: Number(formData.get('idade')),
    legenda: formData.get('legenda') as string,
    photo: formData.get('photo') as File,
  };
  const token = (await cookies()).get('token')?.value;

  const response = await fetch(
    'https://api05.byethost3.com/wp-json/api/photo',
    {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json, text/plain, */*',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
        Referer: 'https://api05.byethost3.com/',
      },
      body: formData,
    },
  );

  const dados = await response.json();

  if (response.ok) {
    redirect('/');
  } 

  return dados;
}

export async function VIDEOGET(): Promise<Video[]> {
  const response = await fetch(
    `https://api05.byethost3.com/wp-json/api/video`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
        Referer: 'https://api05.byethost3.com/',
      },

      cache: 'no-store',
    },
  );

  const contentType = response.headers.get('content-type');

  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();

    console.error('API retornou HTML em vez de JSON:', text);

    return [];
  }

  const data = (await response.json()) as Video[];

  return data;
}

export async function VIDEOPOST(formData: FormData) {

  const token = await Getcookies('token');

  const file = formData.get("video") as File;

  const upload = await uploadCloudinary(file);

  const newFormData = new FormData();

  newFormData.append("video", upload.secure_url);
  newFormData.append("public_id", upload.public_id); 

  newFormData.append("titulo", formData.get("titulo") as string);
  newFormData.append("legenda", formData.get("legenda") as string);

  const response = await fetch('https://api05.byethost3.com/wp-json/api/video', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token.value,
      Accept: 'application/json, text/plain, */*',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
        Referer: 'https://api05.byethost3.com/',
    },
    body: newFormData,
  });

  const data = await response.json();



  return data;
}

export async function PROFILE_GET(username: string) {
  const response = await fetch(
    `https://api05.byethost3.com/wp-json/api/profile/${username}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
        Referer: 'https://api05.byethost3.com/',
      },
    }
  );

  const data = await response.json();

  return data;
}

export async function COMMENT_POST({id}: {id: number}, formData: FormData) {
  const token = await Getcookies("token");


  const response = await fetch(`https://api05.byethost3.com/wp-json/api/comment/${id}`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token.value,
      Accept: 'application/json, text/plain, */*',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
      Referer: 'https://api05.byethost3.com/',
  },
    body: formData,
  });


  const data = await response.json();

  
  return {
    ok: response.ok,
    data,
  };
}

export async function COMMENT_GET({id}: {id: number}) {
  const response = await fetch(`https://api05.byethost3.com/wp-json/api/comment/${id}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
      Referer: 'https://api05.byethost3.com/',
    },
  });


  const data = await response.json();
  return data;
}

export async function COMMENT_DELETE(id: number, token: string) {

  const response = await fetch(`https://api05.byethost3.com/wp-json/api/comment/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/json, text/plain, */*',
       'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
      Referer: 'https://api05.byethost3.com/',
},
}
);


const data = await response.json();

return {
  ok: response.ok,
  status: response.status,
  data,
}
}


export async function LIKE_POST({id}: {id: number}) {
  const token = (await cookies()).get('token')?.value;


  const response = await fetch(`https://api05.byethost3.com/wp-json/api/like/${id}`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/json, text/plain, */*',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
      Referer: 'https://api05.byethost3.com/',
      'Content-Type': 'application/json'
    }
  });

  if (!token) {
    return { error: "Voce  precisa estar logado para curtir" };
  }


 
  const data = await response.json();


  return {
    status: response.status,
    data
  }
}

export async function LIKE_GET({id}: {id: number}) {
  const token = await Getcookies('token')

  const response = await fetch(`https://api05.byethost3.com/wp-json/api/like/${id}`, {
    method: 'GET',
     headers: {
      Authorization: 'Bearer ' + token.value,
      Accept: 'application/json, text/plain, */*',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
      Referer: 'https://api05.byethost3.com/',
      'Content-Type': 'application/json'
    }
  })

  const data = await response.json();

  return data
}

export async function PROFILE_LIKE(username: string) {
  const token = await Getcookies('token');
  
  const response = await fetch(
    `https://api05.byethost3.com/wp-json/api/profile/${username}/like`,
    {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token.value,
        Accept: 'application/json',
        'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
      Referer: 'https://api05.byethost3.com/',
      'Content-Type': 'application/json'
      },
    }
  );

  const data = await response.json();
  return data;
}

export async function PROFILE_LIKE_GET(username: string) {
  const token = await Getcookies('token');
  
  const response = await fetch(
    `https://api05.byethost3.com/wp-json/api/profile/${username}`,
    {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token.value,
        Accept: 'application/json',
        'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
      Referer: 'https://api05.byethost3.com/',
      'Content-Type': 'application/json'
      },
    }
  );

  const data = await response.json();
  return data;
}

export async function PASSWORD_LOST(email: string, url: string) {
  const response = await fetch('https://api05.byethost3.com/wp-json/api/password/lost', {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
      Referer: 'https://api05.byethost3.com/',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({login: email,  url})
  });




  const data = await response.json()

  return data
}

export async function PASSWORD_RESET(login: string, key: string, password: string) {
  const response = await fetch('https://api05.byethost3.com/wp-json/api/password/reset', {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
      Referer: 'https://api05.byethost3.com/',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({login, key, password})
  });

  const data = await response.json()

  return data
}


export async function DELETE_VIDEO({ id }: { id: number }) {
  const token = await Getcookies('token')

  const response = await fetch(
    `https://api05.byethost3.com/wp-json/api/video/${id}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token.value,
         Accept: 'application/json, text/plain, */*',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
        Referer: 'https://api05.byethost3.com/',
      }
    }
  );


  const data = await response.json();


  revalidatePath(`/`)

  return data;
}

export async function GET() {
  const token = await Getcookies('token')


  const response = await fetch(
    'https://api05.byethost3.com/wp-json/api/online',
    {
      method: 'GET',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
        Referer: 'https://api05.byethost3.com/',
      },
      cache: 'no-store',
    },
  );

  const text = await response.json();


  return Response.json(text);
}


export async function ESTATISTICAS_GET() {
  const token = await Getcookies('token')
  const response = await fetch('https://api05.byethost3.com/wp-json/api/stats', {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token.value,
         Accept: 'application/json, text/plain, */*',
        'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
        Referer: 'https://api05.byethost3.com/',
    }
  })

  const data = await response.json()

  return data
}


export async function GET_NEWS() {
  const response = await fetch('https://gnews.io/api/v4/top-headlines?lang=pt&country=br&apikey=1b152441b5b14d4cc0a081cfc6658611', {
    method: 'GET',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
      Referer: 'https://newsapi.org/',
    },
    cache: 'no-store',
  });

  const data = await response.json();

    if (!data.articles) {
    console.error('Erro da API:', data);
    return [];
  }

  return data.articles;
}