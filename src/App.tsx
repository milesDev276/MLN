import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import { useState } from "react";
import items from "./data/item.json";

function Header() {
  return (
    <header className="header">
      <a
        href="/"
        style={{
          color: "black",
        }}
      >
        <div className="logo">
          Khám Phá <span className="codeless">Kinh tế Học</span>
        </div>
      </a>
      <nav className="nav">
        <a href="/item/0" className="nav-link">
          Khái niệm cạnh tranh
        </a>
        <a href="/item/1" className="nav-link">
          Các hình thức cạnh tranh
        </a>
        <a href="/item/2" className="nav-link">
          Khái niệm độc quyền
        </a>
        <a href="/item/3" className="nav-link">
          Quan hệ giữa cạnh tranh và độc quyền
        </a>
      </nav>
    </header>
  );
}

type QuizType = {
  question: string;
  options: string[];
  answer: number;
  explain?: string[];
};

function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

function Quiz({ quiz }: { quiz: QuizType[] }) {
  const [selected, setSelected] = useState<(number | null)[]>(
    Array(quiz.length).fill(null)
  );
  const [showResult, setShowResult] = useState(false);
  const correct = selected.filter((ans, i) => ans === quiz[i].answer).length;
  return (
    <div>
      <h3>Quiz</h3>
      {quiz.map((q, i) => (
        <div key={i} style={{ marginBottom: 16 }}>
          <div>
            <b>
              {i + 1}. {q.question}
            </b>
          </div>
          {q.options.map((opt, j) => (
            <label key={j} style={{ display: "block", marginLeft: 12 }}>
              <input
                type="radio"
                name={`q${i}`}
                checked={selected[i] === j}
                onChange={() => {
                  const copy = [...selected];
                  copy[i] = j;
                  setSelected(copy);
                }}
                disabled={showResult}
              />{" "}
              {opt}
              {showResult && selected[i] === j && (
                <div
                  className="quiz-explain"
                  style={{
                    color: selected[i] === q.answer ? "#177500" : "#f53535",
                  }}
                >
                  {selected[i] === q.answer ? "Chính xác! " : ""}
                  {q.explain && q.explain[j]}
                </div>
              )}
            </label>
          ))}
        </div>
      ))}
      {!showResult ? (
        <button className="quiz-submit-btn" onClick={() => setShowResult(true)}>
          Submit
        </button>
      ) : (
        <div style={{ marginTop: 8 }}>
          Correct: {correct} / {quiz.length}
        </div>
      )}
    </div>
  );
}

type Section =
  | { type: "desc"; title: string; content: string }
  | { type: "list"; title: string; list: string[] };

function renderItemContent(item: { learn: string[] }): React.ReactNode {
  const location = useLocation();
  const isHomePage = location.pathname.split("/")[1] !== "item";

  const sections: Section[] = [];
  let currentSection: Section | null = null;
  item.learn.forEach((line: string) => {
    if (isHomePage) return;
    if (line.startsWith("Giải thích khái niệm:")) {
      if (currentSection) sections.push(currentSection);
      currentSection = {
        type: "desc",
        title: "Giải thích khái niệm",
        content: line.replace("Giải thích khái niệm:", "").trim(),
      };
    } else if (line.startsWith("Các điểm chính:")) {
      if (currentSection) sections.push(currentSection);
      currentSection = { type: "list", title: "Các điểm chính", list: [] };
    } else if (line.startsWith("Ví dụ thực tế:")) {
      if (currentSection) sections.push(currentSection);
      currentSection = {
        type: "desc",
        title: "Ví dụ thực tế",
        content: line.replace("Ví dụ thực tế:", "").trim(),
      };
    } else if (line.startsWith("Liên hệ thời đại:")) {
      if (currentSection) sections.push(currentSection);
      currentSection = {
        type: "desc",
        title: "Liên hệ thời đại",
        content: line.replace("Liên hệ thời đại:", "").trim(),
      };
    } else {
      if (currentSection && currentSection.type === "list") {
        currentSection.list.push(line);
      } else if (currentSection && currentSection.type === "desc") {
        currentSection.content += (currentSection.content ? " " : "") + line;
      }
    }
  });
  if (currentSection) sections.push(currentSection);

  return (
    <>
      {sections.map((sec, i) => (
        <div key={i} style={{ marginBottom: 12 }}>
          <b>{sec.title}</b>
          {sec.type === "desc" && (
            <div style={{ margin: "4px 0 0 0" }}>{sec.content}</div>
          )}
          {sec.type === "list" && (
            <ul style={{ margin: "4px 0 0 16px" }}>
              {sec.list.map((l: string, j: number) => (
                <li key={j}>{l}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </>
  );
}

function ItemList() {
  const navigate = useNavigate();
  const [videoIdx, setVideoIdx] = useState<number | null>(null);
  const [quizIdx, setQuizIdx] = useState<number | null>(null);
  return (
    <main className="main-content">
      <div className="items-grid">
        {items.map((item, idx) => (
          <section
            className="main-card"
            key={idx}
            onClick={() => navigate(`/item/${idx}`)}
            style={{ cursor: "pointer" }}
          >
            <div className="hero-img">
              <img src={item.img} alt={item.title} className="hero-img-el" />
            </div>
            <div className="main-card-btns">
              <button
                className="main-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setVideoIdx(idx);
                }}
              >
                Video minh họa
              </button>
              <button
                className="main-btn-outline"
                onClick={(e) => {
                  e.stopPropagation();
                  setQuizIdx(idx);
                }}
              >
                Small Quiz
              </button>
            </div>
            <div className="main-card-content">
              <h2>
                {idx + 1}. {item.title.toUpperCase()}
              </h2>
              <p>{item.desc}</p>
              {renderItemContent(item)}
            </div>
          </section>
        ))}
      </div>
      <Modal open={videoIdx !== null} onClose={() => setVideoIdx(null)}>
        {videoIdx !== null && (
          <video
            src={items[videoIdx].video}
            controls
            style={{ width: "100%", maxWidth: 900, height: "auto" }}
          />
        )}
      </Modal>
      <Modal open={quizIdx !== null} onClose={() => setQuizIdx(null)}>
        {quizIdx !== null && <Quiz quiz={items[quizIdx].quiz} />}
      </Modal>
    </main>
  );
}

function ItemDetail() {
  const { id } = useParams();
  const idx = Number(id);
  const item = items[idx];
  const [showVideo, setShowVideo] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  if (!item) return <div style={{ padding: 40 }}>Item not found</div>;
  return (
    <main className="main-content">
      <section className="main-card" style={{ maxWidth: 900 }}>
        <div className="hero-img">
          <img src={item.img} alt={item.title} className="hero-img-el" />
        </div>
        <div className="main-card-content-wrap">
          <div className="main-card-btns">
            <button className="main-btn" onClick={() => setShowVideo(true)}>
              VIEW THEME / DEMO
            </button>
            <button
              className="main-btn-outline"
              onClick={() => setShowQuiz(true)}
            >
              VIEW HOST / DEMO
            </button>
          </div>
          <div className="main-card-content">
            <h2>
              {idx + 1}. {item.title.toUpperCase()}
            </h2>
            <p>{item.desc}</p>
            {renderItemContent(item)}
          </div>
        </div>
      </section>
      <Modal open={showVideo} onClose={() => setShowVideo(false)}>
        <video
          src={item.video}
          controls
          style={{ width: "100%", maxWidth: 900, height: "auto" }}
        />
      </Modal>
      <Modal open={showQuiz} onClose={() => setShowQuiz(false)}>
        <Quiz quiz={item.quiz} />
      </Modal>
    </main>
  );
}

function App() {
  return (
    <div className="app-bg">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<ItemList />} />
          <Route path="/item/:id" element={<ItemDetail />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
