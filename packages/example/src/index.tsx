import "./styles.css";
import { GetPropsFunction, useState } from "myjam";

type Post = {
  title: string;
  text: string;
};

type Props = {
  posts: Post[];
};

export default function App(props: Props) {
  const [posts, setPosts] = useState(props.posts);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const buttonDisabled = title.length === 0 || text.length === 0;

  return (
    <main class="p-4 m-auto" style={{ width: "600px" }}>
      <h1 class="text-4xl text-gray-800 mb-4">My posts</h1>
      {posts.map(({ title, text }) => (
        <div class="p-4 mb-4 bg-white border rounded-lg">
          <h2 class="text-2xl text-gray-800">{title}</h2>
          <p class="text-sm text-gray-700">{text}</p>
        </div>
      ))}
      <h1>Add post</h1>
      <input
        value={title}
        class="mt-2 border px-4 py-2 rounded-lg"
        placeholder="Title"
        onInput={({ target: { value } }) => {
          setTitle(value);
        }}
      />
      <textarea
        class="mt-2 block border px-4 py-2 rounded-lg"
        placeholder="Text"
        value={text}
        onInput={({ target: { value } }) => {
          setText(value);
        }}
      />
      <button
        onClick={() => {
          setPosts((posts) => [...posts, { title, text }]);
          setTitle("");
          setText("");
        }}
        disabled={buttonDisabled}
        class={{
          "mt-2 px-4 py-2 text-white rounded-full transition duration-300": true,
          "bg-indigo-300 text-gray-300 cursor-not-allowed": buttonDisabled,
          "bg-indigo-700 hover:bg-indigo-800": !buttonDisabled,
        }}
      >
        Add post
      </button>
    </main>
  );
}

export const getProps: GetPropsFunction<Props> = async (
  fetch /* node-fetch */
) => {
  const fs = await import("fs");
  const data = await fs.promises.readFile("./data.json", { encoding: "utf-8" });
  return JSON.parse(data);
};
