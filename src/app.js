'use strict';

// State
const state = {
  columns: [
    {
      icon: '',
      title: 'Examples',
      cards: [
        { content: 'Explain quantum computing in simple terms', isBtn: true },
        {
          content: 'Got any creative ideas for a 10 year old’s birthday?',
          isBtn: true,
        },
        {
          content: 'How do I make an HTTP request in Javascript?',
          isBtn: true,
        },
      ],
    },
    {
      icon: '',
      title: 'Capabilities',
      cards: [
        {
          content: 'Remembers what user said earlier in the conversation',
          isBtn: false,
        },
        {
          content: 'Allows user to provide follow-up corrections',
          isBtn: false,
        },
        {
          content: 'Trained to decline inappropriate requests',
          isBtn: false,
        },
      ],
    },
    {
      icon: '',
      title: 'Limitations',
      cards: [
        {
          content: 'May occasionally generate incorrect information',
          isBtn: false,
        },
        {
          content:
            'May occasionally produce harmful instructions or biased content',
          isBtn: false,
        },
        {
          content: 'Limited knowledge of world and events after 2021',
          isBtn: false,
        },
      ],
    },
  ],
  chats: [
    {
      id: 1,
      title: 'Chat Example',
    },
  ],
};

// DOM Elements
const appContainer = document.getElementById('app');
const columnsContainer = document.querySelector('.columns');
const chatsContainer = document.querySelector('.chats');

// Config
const OPENAI_API_KEY = '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';
const OPENAI_API_URL = 'https://api.openai.com/v1';
const endpoints = {
  chatCompletions: '/chat/completions', // Post
  models: '/models',
  moderations: '/moderations',
  completions: '/completions', // Post {model, prompt, suffix, max_tokens, temperature, top_p, n, stream, logprobs, echo, stop}
  edits: '/edits',
  images: '/images/generations', // Beta
  imagesVariations: '/images/variations', // Beta
  embeddings: '/embeddings',
  audioTranscriptions: '/audio/transcriptions',
  audioTranslation: '/audio/translations', // Post
  listFiles: '/files', // Get
  uploadFile: '/files', // Post
};

// Helpers
const render = (markup, parent, pos = 'afterbegin') => {
  parent.insertAdjacentHTML(pos, markup);
};

const getJSON = async (url, errorMsg) => {
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`${errorMsg} (${res.status})`);
    const data = await res.json();
    return data;
  } catch (err) {
    throw err;
  }
};

const postJSON = async function (body, url, errorMsg = '') {
  try {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body,
    };

    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`${errorMsg} (${res.status})`);
    const data = await res.json();
    return data;
  } catch (err) {
    throw err;
  }
};

// Components
const Card = ({ content, isBtn }) => {
  return `
  <a
    href="#"
    class="bg-gray-700 hover:bg-gray-600 rounded-md text-center p-3 ${
      isBtn ? 'cursor-pointer' : ''
    }"
    >
    <span class="align-middle text-white text-sm"
      >${content}</span
    >
  </a>
  `;
};

const Column = ({ icon, title, cards }) => {
  return `
    <div class="column flex flex-col items-center justify-center gap-3">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6 text-white"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
        />
      </svg>
      <h3 class="text-white">${title}</h3>
      ${cards
        .map(({ content, isBtn }) =>
          Card({
            content: content,
            isBtn: isBtn,
          })
        )
        .join('')}
    </div>
  `;
};

const Columns = state.columns
  .map((column) =>
    Column({
      icon: column.icon,
      title: column.title,
      cards: column.cards,
    })
  )
  .join('');

const Chat = ({ id, title }) => {
  return `
    <a href="#" data-id="${id}">
      <div
        class="chat flex py-3 px-3 items-center gap-3 relative rounded-md hover:bg-gray-800 cursor-pointer break-all"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-5 h-5 text-white"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
          />
        </svg>
        <input
          type="text"
          value="${title}"
          class="text-white flex-1 overflow-hidden text-ellipsis break-all outline-none bg-transparent"
          readonly
        />
        <div class="chat-btns flex gap-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-4 h-4 text-gray-300 hover:text-white"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-4 h-4 text-gray-300 hover:text-white"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
            />
          </svg>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-4 h-4 text-gray-300 hover:text-white"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
        </div>
      </div>
    </a>
  `;
};

const Chats = state.chats
  .map((chat) =>
    Chat({
      id: chat.id,
      title: chat.title,
    })
  )
  .join('');

// Handlers

// Init
render(Columns, columnsContainer);
render(Chats, chatsContainer);
