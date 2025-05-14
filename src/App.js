import { useState } from 'react';
import openai from './lib/openai';
import ReactMarkdown from 'react-markdown';

const prompt = `
あなたは20年以上のキャリアがあるフルスタックエンジニアです。
今から渡されるコードの
・問題点の指摘
・問題点を修正し、より簡潔にしたコード
・修正点の説明
をそれぞれ別々でMarkdown形式かつ、タイトル部分を###で出力してください。
問題点の指摘や修正点の説明は、プログラミング初心者にもわかるように、詳しく説明お願いいたします。
`;

function App() {
  const [content, setContent] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const review = async () => {
    setIsLoading(true);
    const messages = [
      {
        role: 'user',
        content: prompt + content,
      },
    ];
    const result = await openai.completion(messages);
    setResult(result);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col items-center justify-center">
      <header className="flex w-full max-w-5xl justify-between items-center py-4 px-6">
        <h1 className="text-2xl font-bold text-blue-900">AI Code Reviewer</h1>
      </header>
      <main className="flex w-full max-w-5xl bg-white rounded-lg shadow-xl overflow-hidden h-[70vh]">
        <div className="flex flex-col w-1/2 h-full bg-gray-900 overflow-y-auto">
          <div className="flex-1 p-4 text-white">
            <textarea
              onChange={(e) => {
                setContent(e.target.value);
              }}
              className="h-full w-full bg-transparent text-white resize-none outline-none"
            />
          </div>
          <button
            onClick={review}
            disabled={isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'レビュー中...' : 'レビューする'}
          </button>
        </div>
        <div className="flex flex-col w-1/2 h-full items-center justify-center">
          <div className="p-4 overflow-y-auto w-full">
            {isLoading ? (
              'レビュー中...'
            ) : (
              <ReactMarkdown className="markdown">{result}</ReactMarkdown>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
