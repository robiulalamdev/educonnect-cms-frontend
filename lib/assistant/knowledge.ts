export type KnowledgePassage = {
  id: string;
  title: string;
  keywords: string[];
  content: string;
};

export const KNOWLEDGE_BASE: KnowledgePassage[] = [
  {
    id: "greeting",
    title: "Greeting",
    keywords: ["hi", "hello", "hey", "greetings", "good morning", "good afternoon", "good evening", "assalamu", "salam", "hola", "yo", "welcome"],
    content:
      "Hello there! Hi, nice to meet you. I am the EduConnect Assistant, your friendly helper here to answer questions about the platform. Welcome to EduConnect! How can I help you today?",
  },
  {
    id: "name",
    title: "Assistant Name",
    keywords: ["your name", "who are you", "what are you", "name", "yourself", "called", "assistant"],
    content:
      "I am the EduConnect Assistant. My name is EduConnect Assistant. I am an AI helper built into the EduConnect platform to answer your questions. I am here to help you.",
  },
  {
    id: "howareyou",
    title: "Assistant Well-being",
    keywords: ["how are you", "how r u", "how are u", "hru", "doing", "how's it going", "how do you feel", "how are things"],
    content:
      "I am doing great, thank you for asking! I am feeling wonderful and I am happy to help you today. What can I do for you on EduConnect?",
  },
  {
    id: "platform",
    title: "About EduConnect",
    keywords: ["educonnect", "platform", "about", "what is", "coaching", "education", "cms", "software"],
    content:
      "EduConnect is a comprehensive coaching and education management platform for Bangladesh. It connects teachers, students, and guardians in one place. The platform helps coaching centers manage batches, enrollments, attendance, payments, assignments, and announcements. It also includes a social feed where users can share posts, stories, and connect with each other.",
  },
  {
    id: "roles",
    title: "User Roles",
    keywords: ["role", "roles", "teacher", "student", "guardian", "admin", "super admin", "moderator", "who are"],
    content:
      "EduConnect has five main roles. Teachers create and manage batches, post assignments, take attendance, and share learning materials. Students enroll in batches, view classes, track attendance, and complete assignments. Guardians monitor their children's progress, attendance, and payments. Admins manage teachers, students, and platform content. Super Admins control everything including admin accounts and system settings.",
  },
  {
    id: "signup",
    title: "Sign Up & Registration",
    keywords: ["signup", "sign up", "register", "registration", "create account", "join", "new user", "how to join"],
    content:
      "To create an account, click the Sign Up button on the login page and choose your role: Teacher, Student, or Guardian. Fill in your name, email, phone number, and create a password. After submitting, you will receive a verification email. Click the verification link to activate your account, then sign in.",
  },
  {
    id: "login",
    title: "Login & Forgot Password",
    keywords: ["login", "sign in", "password", "forgot password", "reset", "access", "can't login"],
    content:
      "You can sign in with your email and password. If you forget your password, click 'Forgot Password' on the login page, enter your email, and you will receive a reset link. The admin panel has a separate login at the /admin URL for admins and super admins.",
  },
  {
    id: "batches",
    title: "Batches & Classes",
    keywords: ["batch", "batches", "class", "classes", "subject", "group", "enroll batch", "create batch"],
    content:
      "Batches are groups of students learning a subject under a teacher. Teachers can create batches with a name, subject, class schedule, and fee. Students can browse available batches and enroll in them. Each batch has its own page showing class schedules, attendance, assignments, and announcements.",
  },
  {
    id: "enrollment",
    title: "Enrollment",
    keywords: ["enroll", "enrollment", "enrolled", "join batch", "admission", "admit", "my batches", "how to enroll"],
    content:
      "Students can enroll in batches from the Discover page or a batch's page. Click Enroll on the batch you want. After enrollment you will appear in the teacher's batch roster. Teachers and guardians can manage enrollments from the dashboard. You can view all your enrolled batches under 'My Batches' in the dashboard.",
  },
  {
    id: "attendance",
    title: "Attendance",
    keywords: ["attendance", "present", "absent", "mark attendance", "track", "percentage"],
    content:
      "Teachers mark student attendance for each class. Students and guardians can view attendance records and percentages from the dashboard. Attendance shows which classes a student attended, was absent, or was late.",
  },
  {
    id: "payments",
    title: "Payments & Fees",
    keywords: ["payment", "pay", "fee", "fees", "subscription", "billing", "taka", "monthly fee", "invoice"],
    content:
      "Payments include batch fees and platform subscriptions. Students and guardians can view fee status for each batch and make payments. Teachers can see who has paid. Subscription packages offer different tiers for teachers and coaching centers. Payment history is available in the dashboard.",
  },
  {
    id: "assignments",
    title: "Assignments & Tasks",
    keywords: ["assignment", "assignments", "task", "tasks", "homework", "submit", "deadline", "due"],
    content:
      "Teachers create assignments and tasks for their batches with a title, description, and deadline. Students can view and submit them. Teachers can mark submissions as done or pending. Tasks are shown in the dashboard so nothing is missed.",
  },
  {
    id: "announcements",
    title: "Announcements",
    keywords: ["announcement", "announcements", "notice", "news", "update", "important"],
    content:
      "Announcements are messages posted by teachers or admins to a batch or the whole platform. They appear in the dashboard and feed so students and guardians stay informed about class changes, exams, or events.",
  },
  {
    id: "messaging",
    title: "Messages & Chat",
    keywords: ["message", "messages", "chat", "talk", "contact", "dm", "conversation", "inbox"],
    content:
      "EduConnect includes private messaging between users. You can start a conversation with a teacher, student, or guardian. The messages panel shows your chats, and new messages appear in real time.",
  },
  {
    id: "feed",
    title: "Social Feed & Posts",
    keywords: ["feed", "post", "posts", "story", "stories", "share", "like", "comment", "social"],
    content:
      "The feed is a social space where users can share posts with text, images, or subject tags. You can like and comment on posts and view stories from people you follow. Use the Discover page to find new teachers, students, and content.",
  },
  {
    id: "profile",
    title: "Public Profiles",
    keywords: ["profile", "bio", "about me", "avatar", "picture", "details", "teacher profile", "follow"],
    content:
      "Every user has a public profile showing their name, role, bio, photo, and academic details. You can share your profile link with others. On teacher profiles you can see their subjects, ratings, and reviews.",
  },
  {
    id: "dashboard",
    title: "Dashboard",
    keywords: ["dashboard", "home", "overview", "my page", "stats", "statistics", "summary"],
    content:
      "The dashboard is your personal home page. It shows your role-specific overview: upcoming classes, attendance, enrolled batches, payments, recent assignments, and announcements. Each role sees a different dashboard tailored to their needs.",
  },
  {
    id: "calendar",
    title: "Calendar & Schedule",
    keywords: ["calendar", "schedule", "class time", "timetable", "event", "reminder", "when is class"],
    content:
      "The calendar shows your class schedules, assignments, and events. You can see which classes happen on each day and time. Teachers can add events to their batches so students see them on their calendars.",
  },
  {
    id: "notifications",
    title: "Notifications",
    keywords: ["notification", "notifications", "alert", "bell", "reminder", "push"],
    content:
      "You will receive notifications for important events like new assignments, announcements, payments, and messages. Notifications appear in the bell icon at the top of the app. You can manage which notifications you receive in Settings.",
  },
  {
    id: "settings",
    title: "Settings & Profile Update",
    keywords: ["settings", "edit profile", "change", "update", "photo", "security", "password"],
    content:
      "In Settings you can edit your profile information, change your password, manage notification preferences, and update your security options. Keep your email and phone number up to date to receive important alerts.",
  },
  {
    id: "subscription",
    title: "Subscription Packages",
    keywords: ["subscription", "package", "packages", "plan", "premium", "upgrade", "tier", "price"],
    content:
      "EduConnect offers subscription packages for teachers and coaching centers. Packages provide extra features like more batches, advanced analytics, and priority support. You can view available packages in the dashboard and upgrade anytime.",
  },
  {
    id: "reviews",
    title: "Ratings & Reviews",
    keywords: ["review", "reviews", "rating", "rate", "stars", "feedback", "testimonial"],
    content:
      "Students and guardians can rate and review teachers after joining their batches. Reviews appear on the teacher's public profile and help others choose the right teacher.",
  },
  {
    id: "guardian",
    title: "Guardian Features",
    keywords: ["guardian", "parent", "child", "monitor", "track child", "kids", "dependents"],
    content:
      "Guardians can be linked to student accounts to monitor their progress. As a guardian you can view your child's attendance, payments, assignments, and announcements. You can also send messages to teachers directly.",
  },
  {
    id: "admin",
    title: "Admin Panel",
    keywords: ["admin", "panel", "moderation", "approve", "manage users", "control", "administrator"],
    content:
      "The admin panel is available at the /admin URL for admins, moderators, and super admins. It allows managing users, approving teachers, moderating posts, viewing platform statistics, and configuring system settings.",
  },
  {
    id: "help",
    title: "Getting Help",
    keywords: ["help", "support", "contact", "issue", "problem", "bug", "error", "how"],
    content:
      "If you need help, you can use this assistant for quick answers about the platform. For issues with your account or payments, contact support from the platform. You can also check your email for verification and reset links if something is not working.",
  },
  {
    id: "thanks",
    title: "Thanks",
    keywords: ["thank", "thanks", "thank you", "thx", "appreciate", "great help"],
    content:
      "You are very welcome! I am glad I could help you. If you need anything else about EduConnect, I am always here for you.",
  },
  {
    id: "bye",
    title: "Goodbye",
    keywords: ["bye", "goodbye", "see you", "cya", "later", "good night", "good luck", "farewell"],
    content:
      "Goodbye! It was nice talking with you. I hope you enjoy using EduConnect. Feel free to come back anytime if you need help.",
  },
];
