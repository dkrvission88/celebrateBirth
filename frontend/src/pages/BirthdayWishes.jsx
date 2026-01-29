  import React, { useEffect, useMemo, useState } from "react";
  import "./BirthdayCard.css";

  const employees = [
    {
      id: 1,
      name: "John Doe",
      role: "Senior Software Engineer",
      dob: "27/01",
      doj: "27/01",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
    {
      id: 2,
      name: "Neha Sharma",
      role: "HR Manager",
      dob: "27/01",
      doj: "10/05",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
      {
      id: 2,
      name: "Sulochan prG",
      role: "HR Manager",
      dob: "27/01",
      doj: "10/05",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
    {
      id: 3,
      name: "Rahul Verma",
      role: "UI Developer",
      dob: "18/01",
      doj: "17/01",
      avatar: "https://i.pravatar.cc/150?img=8",
    },
  ];

  const birthdayWishes = [
    "🌸 May your life bloom with happiness!",
    "🌹 Wishing you endless success and joy!",
    "⭐ Shine bright always, Happy Birthday!",
    "✨ May all your dreams come true!",
    "🎊 Have a fantastic year ahead!",
  ];

  const anniversaryWishes = [
    "💐 Happy Work Anniversary! Keep shining!",
    "🏆 Your dedication inspires everyone!",
    "✨ Cheers to your achievements & growth!",
    "🎉 Thank you for your hard work & passion!",
    "💪 Wishing you many more successful years!",
  ];

  export default function BirthdayCard() {
    const [confetti, setConfetti] = useState(false);

    const [birthdayWishIndex, setBirthdayWishIndex] = useState(0);
    const [anniversaryWishIndex, setAnniversaryWishIndex] = useState(0);

    const [activeIndex, setActiveIndex] = useState(0);
    const [animateKey, setAnimateKey] = useState(0);

    //Today date format => DD/MM
    const today = useMemo(() => {
      const d = new Date();
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      return `${day}/${month}`;
    }, []);

    //Make celebrations list (Birthday + Anniversary)
    const todaysCelebrations = useMemo(() => {
      const list = [];

      employees.forEach((emp) => {
        if (emp.dob === today) {
          list.push({
            type: "BIRTHDAY",
            title: "Happy Birthday 🎂",
            wishArr: birthdayWishes,
            emp,
          });
        }

        if (emp.doj === today) {
          list.push({
            type: "ANNIVERSARY",
            title: "Happy Work Anniversary 🏆",
            wishArr: anniversaryWishes,
            emp,
          });
        }
      });

      return list;
    }, [today]);

    //  Auto Wish Text Infinite Loop
    useEffect(() => {
      const timer1 = setInterval(() => {
        setBirthdayWishIndex((prev) => (prev + 1) % birthdayWishes.length);
      }, 2500);

      const timer2 = setInterval(() => {
        setAnniversaryWishIndex((prev) => (prev + 1) % anniversaryWishes.length);
      }, 2800);

      return () => {
        clearInterval(timer1);
        clearInterval(timer2);
      };
    }, []);

    //  Auto Change Card Every 6 Seconds
    useEffect(() => {
      if (todaysCelebrations.length <= 1) return;

      const timer = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % todaysCelebrations.length);
        setAnimateKey((k) => k + 1); //  re-trigger animation
        setConfetti(true);
        setTimeout(() => setConfetti(false), 2000);
      }, 30000);

      return () => clearInterval(timer);
    }, [todaysCelebrations.length]);

    //  Auto Confetti Every 6 Seconds (even if single card)
    useEffect(() => {
      const timer = setInterval(() => {
        setConfetti(true);
        setTimeout(() => setConfetti(false), 2000);
      }, 30000);

      return () => clearInterval(timer);
    }, []);

    const isNothingToday = todaysCelebrations.length === 0;

    const current = todaysCelebrations[activeIndex];

    const currentWish =
      current?.type === "BIRTHDAY"
        ? birthdayWishes[birthdayWishIndex]
        : anniversaryWishes[anniversaryWishIndex];

    return (
      <div className="birthday-container">
        {/*  Left + Right Jhari Fireworks */}
        <div className="firework firework-left" />
        <div className="firework firework-right" />

        {/*  Infinite Floating Emojis */}
        <div className="float-layer">
          {Array.from({ length: 30 }).map((_, i) => (
            <span key={i} className="float-item">
              {["🌸", "🌹", "⭐", "✨", "🎊", "🎉", "💖"][i % 7]}
            </span>
          ))}
        </div>

        {/* Confetti */}
        {confetti && (
          <div className="confetti-wrapper">
            {Array.from({ length: 60 }).map((_, i) => (
              <span key={i} className="confetti" />
            ))}
          </div>
        )}

        {/* If nothing today */}
        {isNothingToday ? (
          <div className="no-birthday">
            <h2>😔 No Celebrations Today</h2>
            <p>Come back tomorrow 🎉</p>
          </div>
        ) : (
          <>
            <div className="top-header">
              <h1>🎉 Today Celebrations</h1>

              <p className="auto-wish">
                {current?.type === "BIRTHDAY" ? "🎂 " : "🏆 "}
                {currentWish}
              </p>

              <p className="counter-text">
                Showing {activeIndex + 1} / {todaysCelebrations.length}
              </p>
            </div>

            {/*  ONLY 1 CARD (Auto Switch) */}
            <div className="single-card-wrapper">
              <div className="card slide-card" key={animateKey}>
                <div className="card-glow" />

                <img
                  src={current.emp.avatar}
                  alt={current.emp.name}
                  className="avatar"
                />

                <h1 className="title">{current.title}</h1>
                <h2 className="name">{current.emp.name}</h2>
                <p className="role">{current.emp.role}</p>

                <p className="message">{currentWish} ✨</p>

                <button className="celebrate-btn">
                  🎉 Celebrate
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }





  // import React, { useEffect, useMemo, useState } from "react";
  // import "./BirthdayCard.css";

  // const employees = [
  //   {
  //     id: 1,
  //     name: "John Doe",
  //     role: "Senior Software Engineer",
  //     dob: "17/01",
  //     avatar: "https://i.pravatar.cc/150?img=3",
  //   },
  //   {
  //     id: 2,
  //     name: "Neha Sharma",
  //     role: "HR Manager",
  //     dob: "17/01",
  //     avatar: "https://i.pravatar.cc/150?img=5",
  //   },
  //   {
  //     id: 3,
  //     name: "Rahul Verma",
  //     role: "UI Developer",
  //     dob: "17/01",
  //     avatar: "https://i.pravatar.cc/150?img=8",
  //   },
  // ];

  // const wishes = [
  //   "🌸 May your life bloom with happiness!", 
  //   "🌹 Wishing you endless success and joy!",
  //   "⭐ Shine bright always, Happy Birthday!",
  //   "✨ May all your dreams come true!",
  //   "🎊 Have a fantastic year ahead!",
  // ];

  // const BirthdayCard = () => {
  //   const [confetti, setConfetti] = useState(false);
  //   const [wishedIds, setWishedIds] = useState([]);
  //   const [wishIndex, setWishIndex] = useState(0);

  //   // ✅ Today date format => DD/MM
  //   const today = useMemo(() => {
  //     const d = new Date();
  //     const day = String(d.getDate()).padStart(2, "0");
  //     const month = String(d.getMonth() + 1).padStart(2, "0");
  //     return `${day}/${month}`;
  //   }, []);

  //   // ✅ All birthdays today
  //   const todaysBirthdays = useMemo(() => {
  //     return employees.filter((emp) => emp.dob === today);
  //   }, [today]);

  //   // ✅ Auto Wish Text Infinite Loop
  //   useEffect(() => {
  //     const timer = setInterval(() => {
  //       setWishIndex((prev) => (prev + 1) % wishes.length);
  //     }, 2500);
  //     return () => clearInterval(timer);
  //   }, []);

  //   // ✅ Auto Confetti Celebration Infinite
  //   useEffect(() => {
  //     const timer = setInterval(() => {
  //       setConfetti(true);
  //       setTimeout(() => setConfetti(false), 2000);
  //     }, 6000);

  //     return () => clearInterval(timer);
  //   }, []);

  //   const handleCelebrate = (id) => {
  //     setWishedIds((prev) => [...new Set([...prev, id])]);
  //     setConfetti(true);
  //     setTimeout(() => setConfetti(false), 2500);
  //   };

  //   const handleWishAll = () => {
  //     setWishedIds(todaysBirthdays.map((e) => e.id));
  //     setConfetti(true);
  //     setTimeout(() => setConfetti(false), 2500);
  //   };

  //   return (
  //     <div className="birthday-container">
  //       {/* ✅ Left + Right Jhari Fireworks */}
  // <div className="firework firework-left" />
  // <div className="firework firework-right" />

  //       {/* ✅ Infinite Floating Emojis */}
  //       <div className="float-layer">
  //         {Array.from({ length: 30 }).map((_, i) => (
  //           <span key={i} className="float-item">
  //             {["🌸", "🌹", "⭐", "✨", "🎊", "🎉", "💖"][i % 7]}
  //           </span>
  //         ))}
  //       </div>

  //       {/* Confetti */}
  //       {confetti && (
  //         <div className="confetti-wrapper">
  //           {Array.from({ length: 60 }).map((_, i) => (
  //             <span key={i} className="confetti" />
  //           ))}
  //         </div>
  //       )}

  //       {/* If no birthday today */}
  //       {todaysBirthdays.length === 0 ? (
  //         <div className="no-birthday">
  //           <h2>😔 No Birthdays Today</h2>
  //           <p>Come back tomorrow 🎉</p>
  //         </div>
  //       ) : (
  //         <>
  //           <div className="top-header">
  //             <h1>🎂 Today Birthdays ({todaysBirthdays.length})</h1>

  //             {/* ✅ Auto Wishes Line */}
  //             <p className="auto-wish">{wishes[wishIndex]}</p>

  //             {/* {todaysBirthdays.length > 1 && (
  //               // <button className="wishall-btn" onClick={handleWishAll}>
  //               //   🎉 Wish All
  //               // </button>
  //             )} */}
  //           </div>

  //           {/* ✅ Show Multiple Cards */}
  //           <div className="cards-grid">
  //             {todaysBirthdays.map((emp) => (
  //               <div className="card" key={emp.id}>
  //                 <div className="card-glow" />

  //                 <img src={emp.avatar} alt={emp.name} className="avatar" />

  //                 <h1 className="title">Happy Birthday 🎂</h1>
  //                 <h2 className="name">{emp.name}</h2>
  //                 <p className="role">{emp.role}</p>

  //                 <p className="message">
  //                   {wishes[wishIndex]} 🎁
  //                 </p>

  //                 <button
  //                   className="celebrate-btn"
  //                   onClick={() => handleCelebrate(emp.id)}
  //                 >
  //                   {wishedIds.includes(emp.id) ? "✅ Wished" : "🎉 Celebrate"}
  //                 </button>
  //               </div>
  //             ))}
  //           </div>
  //         </>
  //       )}
  //     </div>
  //   );
  // };

  // export default BirthdayCard;



  // import React, { useMemo, useState } from "react";
  // import "./BirthdayCard.css";

  // const employees = [
  //   {
  //     id: 1,
  //     name: "John Doe",
  //     role: "Senior Software Engineer",
  //     dob: "17/01",
  //     avatar: "https://i.pravatar.cc/150?img=3",
  //   },
  //   {
  //     id: 2,
  //     name: "Neha Sharma",
  //     role: "HR Manager",
  //     dob: "17/01",
  //     avatar: "https://i.pravatar.cc/150?img=5",
  //   },
    
  //   {
  //     id: 3,
  //     name: "Rahul Verma",
  //     role: "UI Developer",
  //     dob: "22/01",
  //     avatar: "https://i.pravatar.cc/150?img=8",
  //   },
  // ];

  // const BirthdayCard = () => {
  //   const [confetti, setConfetti] = useState(false);
  //   const [wishedIds, setWishedIds] = useState([]);

  //   // ✅ Today date format => DD/MM
  //   const today = useMemo(() => {
  //     const d = new Date();
  //     const day = String(d.getDate()).padStart(2, "0");
  //     const month = String(d.getMonth() + 1).padStart(2, "0");
  //     return `${day}/${month}`;
  //   }, []);

  //   // ✅ All birthdays today
  //   const todaysBirthdays = useMemo(() => {
  //     return employees.filter((emp) => emp.dob === today);
  //   }, [today]);

  //   const handleCelebrate = (id) => {
  //     setWishedIds((prev) => [...new Set([...prev, id])]);
  //     setConfetti(true);
  //     setTimeout(() => setConfetti(false), 2500);
  //   };

  //   const handleWishAll = () => {
  //     setWishedIds(todaysBirthdays.map((e) => e.id));
  //     setConfetti(true);
  //     setTimeout(() => setConfetti(false), 2500);
  //   };

  //   return (
  //     <div className="birthday-container">
  //       {/* Confetti */}
  //       {confetti && (
  //         <div className="confetti-wrapper">
  //           {Array.from({ length: 50 }).map((_, i) => (
  //             <span key={i} className="confetti" />
  //           ))}
  //         </div>
  //       )}

  //       {/* If no birthday today */}
  //       {todaysBirthdays.length === 0 ? (
  //         <div className="no-birthday">
  //           <h2>😔 No Birthdays Today</h2>
  //           <p>Come back tomorrow 🎉</p>
  //         </div>
  //       ) : (
  //         <>
  //           <div className="top-header">
  //             <h1>🎂 Today Birthdays ({todaysBirthdays.length})</h1>

  //             {todaysBirthdays.length > 1 && (
  //               <button className="wishall-btn" onClick={handleWishAll}>
  //                 🎉 Wish All
  //               </button>
  //             )}
  //           </div>

  //           {/* ✅ Show Multiple Cards */}
  //           <div className="cards-grid">
  //             {todaysBirthdays.map((emp) => (
  //               <div className="card" key={emp.id}>
  //                 <div className="card-glow" />

  //                 <img src={emp.avatar} alt={emp.name} className="avatar" />

  //                 <h1 className="title">Happy Birthday 🎂</h1>
  //                 <h2 className="name">{emp.name}</h2>
  //                 <p className="role">{emp.role}</p>

  //                 <p className="message">
  //                   Wishing you a year filled with success, happiness & joy ✨
  //                 </p>

  //                 <button
  //                   className="celebrate-btn"
  //                   onClick={() => handleCelebrate(emp.id)}
  //                 >
  //                   {wishedIds.includes(emp.id) ? "✅ Wished" : "🎉 Celebrate"}
  //                 </button>
  //               </div>
  //             ))}
  //           </div>
  //         </>
  //       )}
  //     </div>
  //   );
  // };

  // export default BirthdayCard;

  // import React, { useEffect, useState } from "react";
  // import "./BirthdayCard.css";

  // const BirthdayCard = () => {
  //   const [confetti, setConfetti] = useState(false);

  //   const handleCelebrate = () => {
  //     setConfetti(true);
  //     setTimeout(() => setConfetti(false), 2500);
  //   };

  //   return (
  //     <div className="birthday-container">
  //       {/* Confetti */}
  //       {confetti && (
  //         <div className="confetti-wrapper">
  //           {Array.from({ length: 40 }).map((_, i) => (
  //             <span key={i} className="confetti" />
  //           ))}
  //         </div>
  //       )}

  //       {/* Floating balloons */}
  //       <div className="balloons">
  //         <span>🎈</span>
  //         <span>🎉</span>
  //         <span>🎈</span>
  //         <span>🎊</span>
  //         <span>✨</span>
  //         <span>🎂</span>
  //         <span>🎈</span>
  //         <span>🎉</span>
  //         <span>🎈</span>
  //         <span>🎊</span>
  //         <span>✨</span>
  //         <span>🎂</span>
  //       </div>

  //       {/* Sparkle stars */}
  //       <div className="sparkles">
  //         <span>✦</span>
  //         <span>✦</span>
  //         <span>✦</span>
  //         <span>✦</span>
  //         <span>✦</span>
  //         <span>✦</span>
  //         <span>✦</span>
  //         <span>✦</span>
  //         <span>✦</span>
  //         <span>✦</span>
  //         <span>✦</span>
  //         <span>✦</span>
  //         <span>✦</span>
  //         <span>✦</span>
  //         <span>✦</span>
  //       </div>

  //       {/* Card */}
  //       <div className="card">
  //         <div className="card-glow" />

  //         <img
  //           src="https://i.pravatar.cc/150?img=3"
  //           alt="Employee"
  //           className="avatar"
  //         />

  //         <h1 className="title">Happy Birthday 🎂</h1>
  //         <h2 className="name">John Doe</h2>
  //         <p className="role">Senior Software Engineer</p>

  //         <p className="message typing">
  //           Wishing you a year filled with success, happiness, and achievements! 🎊
  //         </p>

  //         <button className="celebrate-btn" onClick={handleCelebrate}>
  //           🎉 Celebrate 🎉
  //         </button>
  //       </div>
  //     </div>
  //   );
  // };

  // export default BirthdayCard;

