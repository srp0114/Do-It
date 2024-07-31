"use client";

import { useState } from 'react';
import GNB from '@/app/components/GNB'
import TodoInput from '@/app/components/TodoInput'

const Home: React.FC = () => {
    return (
        <div>
            <GNB />
            <TodoInput/>
        </div>
    );
};

export default Home;
