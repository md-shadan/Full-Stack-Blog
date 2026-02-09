import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import Toast from '../components/Toast.jsx';
import { fetchPosts } from '../services/posts.js';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(6);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('latest');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ type: 'info', message: '' });

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      try {
        const data = await fetchPosts({ page, size, sort, search });
        if (!ignore) {
          setPosts(data.content);
          setTotalPages(data.totalPages);
        }
      } catch (e) {
        setToast({ type: 'error', message: 'Failed to load posts' });
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, [page, size, sort, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Latest Posts</h1>
          <p className="text-ink/60">Search and explore the newest articles.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            className="input"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => { setPage(0); setSearch(e.target.value); }}
          />
          <select className="input" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

      {toast.message && <Toast type={toast.type} message={toast.message} />}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <article key={post.id} className="card p-6 space-y-3">
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="text-ink/70">{post.content}</p>
              <div className="flex items-center justify-between text-sm text-ink/60">
                <span>By {post.authorName}</span>
                <Link to={`/posts/${post.id}`} className="btn btn-outline">Read</Link>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          className="btn btn-outline"
          disabled={page === 0}
          onClick={() => setPage((p) => Math.max(0, p - 1))}
        >
          Previous
        </button>
        <span className="text-sm text-ink/60">Page {page + 1} of {totalPages || 1}</span>
        <button
          className="btn btn-outline"
          disabled={page + 1 >= totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
