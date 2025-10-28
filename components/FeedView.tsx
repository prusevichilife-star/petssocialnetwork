

import React from 'react';
import { User, Post, ActivityFeedItem } from '../types';
import { CurrentView, EnrichedFeedItem } from '../App';
import CreateFeedItemForm from './CreateFeedItemForm';
import FeedFilter, { FilterType } from './FeedFilter';
import PostCard from './PostCard';
import PetActivityCard from './PetActivityCard';

interface FeedViewProps {
    currentUser: User;
    allUsers: User[];
    allPosts: Post[];
    allActivities: ActivityFeedItem[];
    onNavigate: (view: CurrentView, id?: string) => void;
    onLikeFeedItem: (itemId: string) => void;
    onCreatePost: (content: string, petId?: string) => void;
    onCreateActivity: (activityData: Omit<ActivityFeedItem, 'id' | 'type' | 'userId' | 'petId' | 'likeCount'>, petId: string) => void;
}

const FeedView: React.FC<FeedViewProps> = ({
    currentUser,
    allUsers,
    allPosts,
    allActivities,
    onNavigate,
    onLikeFeedItem,
    onCreatePost,
    onCreateActivity
}) => {
    const [activeFilter, setActiveFilter] = React.useState<FilterType>('all');
    const allUsersMap = React.useMemo(() => Object.fromEntries(allUsers.map(u => [u.id, u])), [allUsers]);

    const visibleFeedItems: EnrichedFeedItem[] = React.useMemo(() => {
        const feedItems = [...allPosts, ...allActivities];
        const visibleUserIds = new Set(allUsers
            .filter(owner => {
                if (owner.id === currentUser.id) return true;
                const visibility = owner.privacySettings.activity;
                if (visibility === 'public') return true;
                if (visibility === 'friends' && owner.friends.includes(currentUser.id)) return true;
                return false;
            })
            .map(u => u.id));
        
        const feed: EnrichedFeedItem[] = [];
        feedItems.forEach(item => {
            if (visibleUserIds.has(item.userId)) {
                const owner = allUsersMap[item.userId];
                if (owner) {
                    const pet = owner.pets.find(p => p.id === item.petId);
                    const isLiked = currentUser.likedFeedItems.includes(item.id);

                    if (item.type === 'post') {
                        feed.push({ ...item, user: owner, pet, isLiked });
                    } else if (item.type === 'activity' && pet) {
                        feed.push({ ...item, user: owner, pet, isLiked });
                    }
                }
            }
        });
    
        return feed
            .filter(item => {
                switch(activeFilter) {
                    case 'posts': return item.type === 'post';
                    case 'activities': return item.type === 'activity';
                    case 'friends': return currentUser.friends.includes(item.user.id);
                    case 'all': default: return true;
                }
            })
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [allPosts, allActivities, allUsers, currentUser, activeFilter, allUsersMap]);


    return (
        <div className="max-w-2xl mx-auto">
            <CreateFeedItemForm currentUser={currentUser} allUsers={allUsers} onCreatePost={onCreatePost} onCreateActivity={onCreateActivity} />
            <FeedFilter activeFilter={activeFilter} onFilterChange={setActiveFilter} />
            <div className="mt-6 space-y-6">
            {visibleFeedItems.map(item =>
                item.type === 'post'
                ? <PostCard key={item.id} post={item} onLike={() => onLikeFeedItem(item.id)} onNavigate={onNavigate} />
                : <PetActivityCard key={item.id} activity={item} onLike={() => onLikeFeedItem(item.id)} onNavigate={onNavigate} />
            )}
            </div>
        </div>
    );
}

export default FeedView;