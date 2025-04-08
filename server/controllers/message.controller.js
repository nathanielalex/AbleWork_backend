import User from "../models/user.model.js";
import Company from "../models/company.model.js";
import Message from "../models/message.model.js";

export const searchUsersAndCompanies = async (req, res) => {
  const query = req.query.q;
  const currentId = req.query.currentId;

  if (!query) return res.json([]);

  const userResults = await User.find({
    $and: [
      {
        $or: [
          { firstName: { $regex: query, $options: "i" } },
          { lastName: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
        ],
      },
      { _id: { $ne: currentId } }, // Exclude current user
    ],
  });

  const companyResults = await Company.find({
    $and: [
      {
        $or: [
          { companyName: { $regex: query, $options: "i" } },
          { companyEmail: { $regex: query, $options: "i" } },
        ],
      },
      { _id: { $ne: currentId } }, // Exclude current company
    ],
  });

  // Gabung dan mapping hasil
  const suggestions = [
    ...userResults.map((u) => ({
      type: "user",
      id: u._id,
      name: `${u.firstName} ${u.lastName}`,
      email: u.email,
      avatar: u.profilePicture,
    })),
    ...companyResults.map((c) => ({
      type: "company",
      id: c._id,
      name: c.companyName,
      email: c.companyEmail,
      avatar: c.companyPicture,
    })),
  ];

  res.json(suggestions);
};

export const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;

    const newMessage = new Message({ senderId, receiverId, content });
    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ message: "Error sending message", error: err });
  }
};

export const getConversation = async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 },
      ],
    }).sort({ sentAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: "Error fetching messages", error: err });
  }
};

export const getMessageParticipants = async (req, res) => {
  try {
    const { currentId } = req.params;

    // Cari semua pesan yang melibatkan currentId sebagai sender atau receiver
    const messages = await Message.find({
      $or: [{ senderId: currentId }, { receiverId: currentId }],
    });

    // Ambil semua unique senderId dan receiverId
    const participantIds = new Set();
    messages.forEach((message) => {
      if (message.senderId.toString() !== currentId) {
        participantIds.add(message.senderId.toString());
      }
      if (message.receiverId.toString() !== currentId) {
        participantIds.add(message.receiverId.toString());
      }
    });

    // Cari detail user dan company berdasarkan participantIds
    const users = await User.find({ _id: { $in: Array.from(participantIds) } });
    const companies = await Company.find({
      _id: { $in: Array.from(participantIds) },
    });

    // Gabungkan hasil user dan company ke dalam format yang sama
    const participants = [
      ...users.map((u) => ({
        type: "user",
        id: u._id,
        name: `${u.firstName} ${u.lastName}`,
        email: u.email,
        avatar: u.profilePicture || "/images/default-avatar.png",
      })),
      ...companies.map((c) => ({
        type: "company",
        id: c._id,
        name: c.companyName,
        email: c.companyEmail,
        avatar: c.companyPicture || "/images/default-company.png",
      })),
    ];

    res.status(200).json(participants);
  } catch (err) {
    console.error("Error fetching message participants:", err);
    res
      .status(500)
      .json({ message: "Error fetching participants", error: err });
  }
};
