"use strict";
// import { Server, Socket } from "socket.io";
// import { Server as HTTPServer } from "http";
// import { commentRepositoryImpl } from "../../repositoryImpl/commentRepositoryImpl";
// import { Comment } from "../../../domain/entities/comment";
// import { NotificationRepositoryImp } from "../../repositoryImpl/NotificationRepositoryImpl";
// import { Notification } from "../../../domain/entities/notification";
// import mongoose from "mongoose";
// // repositories
// const commentRepository = new commentRepositoryImpl()
// const notificationRepository = new NotificationRepositoryImp()
// let activeUsers: { userId: string; socketId: string }[] = [];
// let pendingCalls: any[] = [];
// // Helper function to find a user by ID
// // Initialize the socket
// export const initializeSocket = (server: HTTPServer) => {
//     console.log("socket server seting up")
//     const io = new Server(server, {
//         cors: {
//             origin: "*",
//             methods: ["GET", "POST"],
//             credentials: true,
//         },
//     });
//     const findUserById = (userId: string) => activeUsers.find((user) => user.userId === userId);
//     io.on("connection", (socket: Socket) => {
//         console.log("Connected client:", socket.id);
//         // Handle new user addition
//         socket.on("new-user-add", (newUserId) => {
//             const existingUser = findUserById(newUserId);
//             if (existingUser) {
//                 existingUser.socketId = socket.id;
//             } else {
//                 activeUsers.push({ userId: newUserId, socketId: socket.id });
//             }
//             console.log("Active users:", activeUsers);
//             io.emit("get-users", activeUsers);
//             socket.emit("active-users-count", activeUsers.length);
//             // Process pending calls
//             const callsForUser = pendingCalls.filter((call) => call.userToCall === newUserId);
//             if (callsForUser.length > 0) {
//                 console.log(`Processing ${callsForUser.length} pending calls for user: ${newUserId}`);
//                 callsForUser.forEach((call) => {
//                     io.to(socket.id).emit("callUser", {
//                         signal: call.signalData,
//                         from: call.from,
//                     });
//                 });
//                 // Remove processed calls
//                 pendingCalls = pendingCalls.filter((call) => call.userToCall !== newUserId);
//             }
//         });
//         // Handle messages
//         socket.on("send-message", (data) => {
//             const user = findUserById(data.receiverId);
//             if (user) {
//                 io.to(user.socketId).emit("receive-message", data);
//             }
//         });
//         // Handle call-related events
//         socket.on("callUser", (data) => {
//             const userToCall = findUserById(data.userToCall);
//             if (userToCall) {
//                 io.to(userToCall.socketId).emit("callUser", {
//                     signal: data.signalData,
//                     from: data.from,
//                 });
//             } else {
//                 pendingCalls.push(data);
//             }
//         });
//         socket.on("answerCall", (data) => {
//             const user = findUserById(data.to);
//             if (user) {
//                 io.to(user.socketId).emit("callAccepted", { signal: data.signal, from: data.from });
//             }
//         });
//         socket.on("endCall", (data) => {
//             const user = findUserById(data.to);
//             if (user) {
//                 io.to(user.socketId).emit("callEnded", { from: data.from });
//             }
//         });
//         // Handle notifications
//         socket.on("sendNotification", (data) => {
//             const user = findUserById(data.userId);
//             if (user) {
//                 io.to(user.socketId).emit("receiveNotification", data);
//             }
//         });
//         socket.on("removeNotification", (data) => {
//             const user = findUserById(data.userId);
//             if (user) {
//                 io.to(user.socketId).emit("receiveRemoveNotification", data);
//             }
//         });
//          let commentCount = 0
//         // savedNewComment
//         socket.on("send-comment",async (data)=>{
//             console.log('request was reached inside the send comment',data)
//             const newComment = new Comment(
//                 new mongoose.Types.ObjectId(data.postId),  // Ensure the postId is of the correct ObjectId type
//                 [{
//                   userId: new mongoose.Types.ObjectId(data.comment.userId),  // Directly adding the object
//                   content: data.comment.content,  // The content from the incoming data
//                   createdAt: new Date()  // Current date for createdAt
//                 }],
//                 new Date()  // Current date for createdAt
//               );
//             const savedComment = await commentRepository.save(newComment)
//             console.log('saved comment',savedComment)
//             const NotifcationMessage = "commented on your post";
//             let notification 
//             if(savedComment?.userId){
//                 notification = new Notification(
//                     savedComment?.userId,
//                     data.receiverId,
//                     '',
//                     savedComment?.postId, // Assuming `entityId` refers to the postId
//                     NotifcationMessage,
//                     "comment",
//                     false
//                 );
//             }
//             let savedNotification
//             if(notification){
//                 savedNotification = await notificationRepository.save(notification)
//             }
//              console.log('saved notification ',savedNotification)    
//             const user = findUserById(data.initiatorId)
//             console.log("user",user)
//             if(user){
//                 io.to(user.socketId).emit("receive-comment",savedComment)
//             }
//         })
//         // Handle disconnection
//         socket.on("disconnect", () => {
//             activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
//             console.log("User disconnected. Updated active users:", activeUsers);
//             io.emit("get-users", activeUsers);
//         });
//     });
// };
