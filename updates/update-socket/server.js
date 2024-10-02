// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const maxAttempts = 3;
const cooldownPeriod = 30000;  // 30 seconds
let failedAttempts = {};  // To track failed attempts by socket ID
let cooldowns = {};  // To track cooldown timers by socket ID

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Reset attempts and cooldowns when a user connects
    failedAttempts[socket.id] = 0;
    cooldowns[socket.id] = false;

    // Listen for slider release event from client
    socket.on('sliderRelease', ({ position, timeDiff }) => {
        if (cooldowns[socket.id]) {
            socket.emit('cooldownActive', { message: 'You are in a cooldown period. Please wait.' });
            return;
        }

        // Perform validation (e.g., time check, position check)
        if (timeDiff < 2000) {
            socket.emit('invalidAttempt', { message: 'Too fast! Possible bot detected.' });
        } else if (position !== 100) {  // Example validation
            failedAttempts[socket.id] += 1;
            if (failedAttempts[socket.id] >= maxAttempts) {
                initiateCooldown(socket);
            } else {
                socket.emit('invalidAttempt', { 
                    message: `Incorrect position. (${failedAttempts[socket.id]}/${maxAttempts} attempts)` 
                });
            }
        } else {
            // If CAPTCHA is correct
            socket.emit('validCaptcha', { message: 'Verification successful!' });
            failedAttempts[socket.id] = 0;  // Reset failed attempts
        }
    });

    // Initiate cooldown for a user after too many failed attempts
    const initiateCooldown = (socket) => {
        cooldowns[socket.id] = true;
        socket.emit('cooldownStart', { message: `Cooldown started. Please wait ${cooldownPeriod / 1000} seconds.` });

        setTimeout(() => {
            cooldowns[socket.id] = false;
            failedAttempts[socket.id] = 0;  // Reset failed attempts after cooldown
            socket.emit('cooldownEnd', { message: 'Cooldown ended. You can try again.' });
        }, cooldownPeriod);
    };

    // Clean up when a user disconnects
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        delete failedAttempts[socket.id];
        delete cooldowns[socket.id];
    });
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
