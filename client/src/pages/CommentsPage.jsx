import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { useAuth } from '../AuthContext.jsx';

const CommentPage = () => {
  const [parentPost, setParentPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [replies, setReplies] = useState({});
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [expandedReplies, setExpandedReplies] = useState(new Set());
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const { postType, postId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const isRant = postType === 'rant';
  const themeColor = isRant ? 'red' : 'pink';
  const postLabel = isRant ? 'Rant' : 'Confession';
  const backPath = isRant ? '/rants' : '/confessions';

  useEffect(() => {
    fetchCommentsData();
  }, [postType, postId]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchCommentsData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://projectx-production-7788.up.railway.app/comment/top?postType=${postType}&postId=${postId}`);
      setParentPost(response.data.parentPost);
      setComments(response.data.comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setMessage('Error loading comments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchReplies = async (commentId) => {
    try {
      const response = await axios.get(`https://projectx-production-7788.up.railway.app/comment/replies?parentCommentId=${commentId}`);
      setReplies(prev => ({
        ...prev,
        [commentId]: response.data.replies
      }));
    } catch (error) {
      console.error('Error fetching replies:', error);
      setMessage('Failed to load replies');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      setMessage('Please write something before submitting.');
      return;
    }

    setSubmitting(true);
    setMessage('');

    try {
      await axios.post('https://projectx-production-7788.up.railway.app/comment', {
        content: newComment,
        parentPostId: postId,
        parentPostType: postType
      });

      setNewComment('');
      setMessage('Comment posted successfully!');
      fetchCommentsData();
    } catch (error) {
      setMessage('Failed to post comment. Please try again.');
      console.error('Error posting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReplySubmit = async (parentCommentId) => {
    if (!replyText.trim()) return;

    try {
      await axios.post('https://projectx-production-7788.up.railway.app/comment', {
        content: replyText,
        parentPostId: postId,
        parentPostType: postType,
        parentCommentId: parentCommentId
      });

      setReplyText('');
      setReplyingTo(null);
      fetchReplies(parentCommentId);
      setMessage('Reply posted successfully!');
    } catch (error) {
      console.error('Error posting reply:', error);
      setMessage('Failed to post reply');
    }
  };

  const toggleReplies = async (commentId) => {
    const newExpanded = new Set(expandedReplies);

    if (expandedReplies.has(commentId)) {
      newExpanded.delete(commentId);
    } else {
      newExpanded.add(commentId);
      if (!replies[commentId]) {
        await fetchReplies(commentId);
      }
    }

    setExpandedReplies(newExpanded);
  };

  const sortedComments = [...comments].sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'newest':
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  const getTimeAgo = (date) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffInMinutes = Math.floor((now - commentDate) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
    return commentDate.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${isRant ? 'from-red-50 via-white to-red-100' : 'from-pink-50 via-white to-pink-100'} font-inter`}>
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl py-16 px-8 text-center border border-white/20">
            <div className={`animate-spin rounded-full h-12 w-12 border-4 border-gray-200 ${isRant ? 'border-t-red-500' : 'border-t-pink-500'} mx-auto mb-4`}></div>
            <p className="text-gray-600 font-medium">Loading comments...</p>
            <p className="text-gray-400 text-sm mt-1">Please wait a moment</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${isRant ? 'from-red-50 via-white to-red-100' : 'from-pink-50 via-white to-pink-100'} font-inter`}>
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Enhanced Back Navigation */}
        <div className="mb-8">
          <button
            onClick={() => navigate(backPath)}
            className={`group flex items-center gap-3 ${isRant ? 'text-red-600 hover:text-red-700' : 'text-pink-600 hover:text-pink-700'} font-semibold transition-all duration-200 hover:gap-4`}
          >
            <div className={`p-1.5 rounded-full transition-colors ${isRant ? 'group-hover:bg-red-50' : 'group-hover:bg-pink-50'}`}>
              <svg width={18} height={18} fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
              </svg>
            </div>
            Back to {isRant ? 'Rants' : 'Confessions'}
          </button>
        </div>

        {/* Enhanced Parent Post Card */}
        {parentPost && (
          <div className={`bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20 mb-8 hover:shadow-2xl transition-all duration-300`}>
            <div className="flex items-start gap-4 mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${isRant ? 'from-red-400 to-red-600' : 'from-pink-400 to-pink-600'} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                <svg width={24} height={24} fill="white" viewBox="0 0 16 16">
                  {isRant ? (
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                  ) : (
                    <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
                  )}
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-bold text-gray-800">Anonymous</span>
                  <span className={`px-3 py-1.5 ${isRant ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-pink-100 text-pink-700 border border-pink-200'} text-xs rounded-full font-semibold uppercase tracking-wide`}>
                    {postLabel}
                  </span>
                  {/* <span className="text-gray-400 text-sm">
                    {getTimeAgo(parentPost.createdAt)}
                  </span> */}
                </div>
                <p className="text-gray-800 leading-relaxed text-lg font-medium">
                  {parentPost.content}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Add Comment Section */}
        <div className={`bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 mb-8 hover:shadow-2xl transition-all duration-300`}>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
              <svg width={18} height={18} fill="white" viewBox="0 0 16 16">
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
              </svg>
            </div>
            <span className="font-bold text-gray-800 text-lg">Share your thoughts</span>
          </div>

          <form onSubmit={handleCommentSubmit} className="ml-14">
            <div className={`border-2 rounded-2xl focus-within:border-${themeColor}-400 transition-all duration-200 bg-gray-50 focus-within:bg-white focus-within:shadow-md`}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="What are your thoughts on this? Try to be respectful and constructive..."
                className="w-full p-4 bg-transparent border-none focus:outline-none text-base resize-none rounded-2xl"
                rows="3"
                maxLength="500"
              />
            </div>

            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center gap-4">
                <span className={`text-sm ${newComment.length > 450 ? 'text-red-500 font-semibold' : 'text-gray-500'}`}>
                  {newComment.length}/500
                </span>
                {newComment.length > 450 && (
                  <span className="text-xs text-red-500 font-medium">
                    {500 - newComment.length} characters remaining
                  </span>
                )}
              </div>
              <div className="flex gap-3">
                {newComment.trim() && (
                  <button
                    type="button"
                    onClick={() => setNewComment('')}
                    className="px-6 py-2.5 text-gray-600 hover:text-gray-700 hover:bg-gray-100 font-semibold text-sm transition-all duration-200 rounded-full"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="submit"
                  disabled={submitting || !newComment.trim()}
                  className={`px-8 py-2.5 ${isRant ? 'bg-red-600 hover:bg-red-700 focus:ring-red-200' : 'bg-pink-600 hover:bg-pink-700 focus:ring-pink-200'} text-white rounded-full shadow-lg font-bold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-4 hover:shadow-xl hover:scale-105`}
                >
                  {submitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Posting...
                    </div>
                  ) : (
                    'Post Comment'
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Enhanced Message Display */}
          {message && (
            <div className={`mt-6 rounded-2xl py-3 px-4 font-semibold text-sm ml-14 border-l-4 transition-all duration-300
                ${message.includes('Error') || message.includes('Failed')
                ? 'bg-red-50 text-red-700 border-red-400'
                : message.includes('write')
                  ? 'bg-amber-50 text-amber-700 border-amber-400'
                  : 'bg-green-50 text-green-700 border-green-400'
              }`
            }>
              <div className="flex items-center gap-2">
                {message.includes('success') ? (
                  <svg width={16} height={16} fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.061L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                  </svg>
                ) : (
                  <svg width={16} height={16} fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                  </svg>
                )}
                {message}
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Comments Section Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-2xl font-bold ${isRant ? 'text-red-700' : 'text-pink-700'} flex items-center gap-3`}>
            <svg width={24} height={24} fill="currentColor" viewBox="0 0 16 16">
              <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z" />
            </svg>
            {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
          </h3>

          {/* Sort Options */}
          {comments.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`px-3 py-1.5 border border-gray-200 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-${themeColor}-200 bg-white`}
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </div>
          )}
        </div>

        {/* Enhanced Comments List */}
        {comments.length === 0 ? (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl py-16 px-8 text-center border border-white/20">
            <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${isRant ? 'from-red-100 to-red-200' : 'from-pink-100 to-pink-200'} rounded-3xl flex items-center justify-center`}>
              <svg width={32} height={32} className="text-gray-400" fill="currentColor" viewBox="0 0 16 16">
                <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-gray-600 mb-2">No comments yet</h4>
            <p className="text-gray-400 text-lg">Be the first to share your thoughts on this {postLabel.toLowerCase()}!</p>
            <p className="text-gray-300 text-sm mt-2">Start a conversation</p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedComments.map((comment) => (
              <div key={comment._id} className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
                {/* Enhanced Main Comment */}
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                      <svg width={18} height={18} fill="white" viewBox="0 0 16 16">
                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="font-bold text-gray-800">Anonymous</span>
                        <span className="text-gray-500 text-sm font-medium">
                          {getTimeAgo(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-800 leading-relaxed mb-4 text-base">
                        {comment.content}
                      </p>

                      {/* Enhanced Comment Actions */}
                      <div className="flex items-center gap-6 text-sm">
                        <button
                          onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                          className={`${isRant ? 'text-red-600 hover:text-red-700 hover:bg-red-50' : 'text-pink-600 hover:text-pink-700 hover:bg-pink-50'} font-semibold transition-all duration-200 flex items-center gap-2 px-3 py-1.5 rounded-full`}
                        >
                          <svg width={16} height={16} fill="currentColor" viewBox="0 0 16 16">
                            <path d="M5.921 11.9 1.353 8.62a.719.719 0 0 1 0-1.238L5.921 4.1A.716.716 0 0 1 7 4.719v1.846c.756.021 1.477.078 2.132.205 1.946.378 3.013 1.204 3.013 2.953 0 .847-.39 1.717-.746 2.324a1.716 1.716 0 0 1-.81.631 1.615 1.615 0 0 1-.418.094c-.418.026-.776-.017-.962-.085-.188-.07-.316-.159-.316-.252 0-.14.315-.518.747-1.154.432-.635.69-1.347.69-2.071 0-.86-.606-1.464-1.72-1.633-.714-.108-1.538-.114-2.61-.114V8.28c0 .393-.474.669-.921.38z" />
                          </svg>
                          Reply
                        </button>

                        {comment.replyCount > 0 && (
                          <button
                            onClick={() => toggleReplies(comment._id)}
                            className="text-gray-600 hover:text-gray-700 hover:bg-gray-50 font-semibold transition-all duration-200 flex items-center gap-2 px-3 py-1.5 rounded-full"
                          >
                            <svg width={16} height={16} fill="currentColor" viewBox="0 0 16 16" className={`transition-transform duration-200 ${expandedReplies.has(comment._id) ? 'rotate-180' : ''}`}>
                              <path d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
                            </svg>
                            {comment.replyCount} {comment.replyCount === 1 ? 'reply' : 'replies'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Reply Input */}
                {replyingTo === comment._id && (
                  <div className="px-6 pb-6">
                    <div className="ml-14 bg-gray-50/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-100">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-xl flex items-center justify-center flex-shrink-0">
                          <svg width={14} height={14} fill="white" viewBox="0 0 16 16">
                            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="border-2 border-gray-200 rounded-xl focus-within:border-gray-400 transition-colors bg-white">
                            <textarea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Write a thoughtful reply..."
                              className="w-full p-3 bg-transparent border-none focus:outline-none resize-none rounded-xl"
                              rows="2"
                              maxLength="500"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center ml-11">
                        <span className="text-xs text-gray-500">{replyText.length}/500</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyText('');
                            }}
                            className="px-4 py-2 text-gray-600 hover:text-gray-700 hover:bg-gray-100 font-semibold text-sm transition-all duration-200 rounded-full"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleReplySubmit(comment._id)}
                            disabled={!replyText.trim()}
                            className={`px-6 py-2 ${isRant ? 'bg-red-600 hover:bg-red-700 focus:ring-red-200' : 'bg-pink-600 hover:bg-pink-700 focus:ring-pink-200'} text-white rounded-full font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-4 hover:shadow-lg`}
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Enhanced Replies Section */}
                {expandedReplies.has(comment._id) && replies[comment._id] && (
                  <div className="border-t border-gray-100 bg-gray-50/50 backdrop-blur-sm rounded-b-3xl">
                    <div className="p-6">
                      <div className="space-y-4">
                        {replies[comment._id].map((reply) => (
                          <div key={reply._id} className="flex items-start gap-3 ml-8 p-4 bg-white/80 rounded-2xl border border-white/50 hover:bg-white transition-all duration-200">
                            <div className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-500 rounded-xl flex items-center justify-center flex-shrink-0">
                              <svg width={14} height={14} fill="white" viewBox="0 0 16 16">
                                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-semibold text-gray-700 text-sm">Anonymous</span>
                                <span className="text-gray-400 text-xs">
                                  {getTimeAgo(reply.createdAt)}
                                </span>
                              </div>
                              <p className="text-gray-800 text-sm leading-relaxed">
                                {reply.content}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentPage;
