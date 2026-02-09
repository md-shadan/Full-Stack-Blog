import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import Toast from '../components/Toast.jsx';
import { fetchPostById } from '../services/posts.js';

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ type: 'info', message: '' });

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      try {
        const data = await fetchPostById(id);
        if (!ignore) setPost(data);
      } catch (e) {
        setToast({ type: 'error', message: 'Failed to load post' });
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, [id]);

  if (loading) return <LoadingSpinner />;

  if (!post) return <div>Post not found</div>;

  return (
    <div className="space-y-4">
      <Link to="/" className="text-sm text-ink/60">? Back</Link>
      {toast.message && <Toast type={toast.type} message={toast.message} />}
      <div className="card p-8 space-y-4">
        <h1 className="text-3xl font-bold">{post.title}</h1>
        <p className="text-sm text-ink/60">By {post.authorName}</p>
        <div className="text-ink/80 whitespace-pre-wrap">{post.content}</div>
      </div>
    </div>
  );
}
