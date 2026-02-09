import { useEffect, useMemo, useState } from 'react';
import Toast from '../components/Toast.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { createPost, deletePost, fetchPosts, updatePost } from '../services/posts.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ type: 'info', message: '' });
  const [form, setForm] = useState({ title: '', content: '' });
  const [editingId, setEditingId] = useState(null);

  const canEdit = (post) => user?.role === 'ADMIN' || post.authorName === user?.name;

  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await fetchPosts({ page: 0, size: 50, sort: 'latest' });
      setPosts(data.content);
    } catch (e) {
      setToast({ type: 'error', message: 'Failed to load posts' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPosts(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content) {
      setToast({ type: 'error', message: 'Title and content are required' });
      return;
    }
    try {
      if (editingId) {
        await updatePost(editingId, form);
        setToast({ type: 'success', message: 'Post updated' });
      } else {
        await createPost(form);
        setToast({ type: 'success', message: 'Post created' });
      }
      setForm({ title: '', content: '' });
      setEditingId(null);
      loadPosts();
    } catch (e) {
      setToast({ type: 'error', message: 'Save failed' });
    }
  };

  const handleEdit = (post) => {
    setEditingId(post.id);
    setForm({ title: post.title, content: post.content });
  };

  const handleDelete = async (id) => {
    try {
      await deletePost(id);
      setToast({ type: 'success', message: 'Post deleted' });
      loadPosts();
    } catch (e) {
      setToast({ type: 'error', message: 'Delete failed' });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-ink/60">Create, edit, and manage your posts.</p>
      </div>

      {toast.message && <Toast type={toast.type} message={toast.message} />}

      <form className="card p-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="label">Title</label>
          <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>
        <div>
          <label className="label">Content</label>
          <textarea className="input min-h-[140px]" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
        </div>
        <div className="flex gap-2">
          <button className="btn btn-primary" type="submit">{editingId ? 'Update Post' : 'Create Post'}</button>
          {editingId && (
            <button className="btn btn-outline" type="button" onClick={() => { setEditingId(null); setForm({ title: '', content: '' }); }}>Cancel</button>
          )}
        </div>
      </form>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <div key={post.id} className="card p-5 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{post.title}</h3>
                  <p className="text-sm text-ink/60">By {post.authorName}</p>
                </div>
                {canEdit(post) && (
                  <div className="flex gap-2">
                    <button className="btn btn-outline" onClick={() => handleEdit(post)}>Edit</button>
                    <button className="btn btn-outline" onClick={() => handleDelete(post.id)}>Delete</button>
                  </div>
                )}
              </div>
              <p className="text-ink/70">{post.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
