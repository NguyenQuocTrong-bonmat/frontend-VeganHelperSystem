import React from 'react';
import { useNavigate } from 'react-router-dom';
import CreatePostForm from '../../components/home/CreatePostForm';

export default function CreatePost() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-vh-cream py-10 px-4 sm:px-6 relative overflow-hidden font-dm-sans text-vh-text-primary">
      {/* Botanical Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-vh-mint rounded-full mix-blend-multiply filter blur-3xl opacity-40 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-vh-sage rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mb-8 text-center">
          <h1 className="font-dm-serif text-3xl sm:text-4xl text-vh-forest font-normal mb-2">
            Create Post
          </h1>
          <p className="text-vh-text-secondary text-sm sm:text-base">
            Share your plant-based recipes, stories, and culinary ideas with the community.
          </p>
        </div>

        <div className="bg-vh-glass backdrop-blur-[16px] border border-white/70 shadow-glass rounded-card-lg p-6 sm:p-10">
          <CreatePostForm
            isModal={false}
            onSuccess={() => navigate('/my-posts')}
            onCancel={() => navigate('/my-posts')}
          />
        </div>
      </div>
    </div>
  );
}
