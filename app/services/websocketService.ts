// app/services/websocketService.ts
import { useEffect } from 'react';

const websocketService = (onMessage: (data: any) => void) => {
    useEffect(() => {
        const socketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:3000';

        if (!socketUrl) {
            console.error('WebSocket URL not found in environment variables.');
            return;
        }

        const ws = new WebSocket(socketUrl);

        ws.onopen = () => {
            console.log('WebSocket connected');
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                onMessage(data);
            } catch (error) {
                console.error('Failed to parse WebSocket message:', error);
            }
        };

        ws.onclose = () => {
            console.log('WebSocket disconnected');
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        return () => {
            ws.close();
        };
    }, [onMessage]);
};

export default websocketService;