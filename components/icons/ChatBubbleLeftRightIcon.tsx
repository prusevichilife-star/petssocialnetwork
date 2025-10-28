import React from 'react';

const ChatBubbleLeftRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.72-3.72a1.125 1.125 0 00-1.59.022l-2.17 2.17-2.17-2.17a1.125 1.125 0 00-1.59-.022l-3.72 3.72-1.98-.99v-4.286c0-.97.616-1.813 1.5-2.097A48.006 48.006 0 0112 8.25c2.69 0 5.23.34 7.624.962z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-4.418 0-8 2.91-8 6.5s3.582 6.5 8 6.5 8-2.91 8-6.5S16.418 3 12 3z" />
    </svg>
);

export default ChatBubbleLeftRightIcon;