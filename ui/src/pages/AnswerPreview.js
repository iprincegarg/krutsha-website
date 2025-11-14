import { useEffect, useState, useRef, useLayoutEffect } from "react";
import "./AnswerPreview.css";
import { marked } from "marked";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

// Preserve single line breaks in markdown as <br /> tags (GitHub-flavored behavior)
// ADD this function before the component:
function parseMarkdown(markdown) {
  let html = markdown;
  
  // Convert bold text (between asterisks)
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<strong>$1</strong>');
  
  // Convert line breaks
  html = html.replace(/\n\n/g, '</p><p style="margin-bottom: 1em;">');
  html = html.replace(/\n/g, '<br/>');
  
  // Convert unordered lists
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ul style="margin-bottom: 1em; padding-left: 1.5rem;">$1</ul>');
  
  // Convert ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
  
  // Wrap in paragraph tags
  html = '<p style="margin-bottom: 1em;">' + html + '</p>';
  
  // Clean up multiple paragraph tags
  html = html.replace(/<\/p><p style="margin-bottom: 1em;"><p style="margin-bottom: 1em;">/g, '</p><p style="margin-bottom: 1em;">');
  html = html.replace(/<\/p><\/p>/g, '</p>');
  
  return html;
}

export default function AnswerPreview() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const VALIDATE_KEY_URL =
    "https://krutsha.ireavaschool.in/validate-answer-preview-key";

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [userData, setUserData] = useState({});
  const [skimcards, setSkimcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  // Use refs for touch coordinates to avoid re-renders and stale state in handlers
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndX = useRef(0);
  const touchEndY = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  // refs to measure content height so card height can adapt to content
  const frontContentRef = useRef(null);
  const backContentRef = useRef(null);
  const skimcardRef = useRef(null);
  const [cardHeight, setCardHeight] = useState(null);
  const [skimcardHeight, setSkimcardHeight] = useState(0);

  // 🔹 Validate key and fetch markdown from backend
  async function validateKey(key) {
    if (!key) return null;
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${VALIDATE_KEY_URL}?key=${encodeURIComponent(key)}`
      );

      if (!data || !data.success) {
        setMessage(data.message);
        return;
      }

      const user = data.data || {};
      setUserData(user);
      processMarkdown(user?.content || "");
    } catch (error) {
      console.error("error in validate key:: ", error);
    } finally {
      setLoading(false);
    }
  }

  // 🔹 Parse markdown and split into front/back of cards
  function processMarkdown(markdownText) {
    // Split by "---" to get individual skimcards
    const sections = markdownText.split(/\n---\n/);
    const cards = [];

    sections.forEach((section) => {
      // Extract skimcard number
      const numMatch = section.match(/\*Skimcard\s*(\d+)\*/i);
      if (!numMatch) return;
      
      const num = numMatch[1];
      
      // Split at "Can you answer below questions?"
      const parts = section.split(/\*Can you answer below questions\?\*/i);
      
      if (parts.length >= 2) {
        // Front: Everything before questions
        const frontContent = parts[0].trim();
        
        // Back: Questions part
        const backContent = parts[1].trim();
        
        cards.push({
          num,
          id: `skimcard-${num}`,
front: parseMarkdown(frontContent),
back: parseMarkdown("**Questions**\n\n" + backContent)
        });
      }
    });

    console.log("Parsed skimcards:", cards);
    setSkimcards(cards);
  }

  useEffect(() => {
    const key = searchParams.get('key');
    if (!key) {
      navigate('/', { replace: true });
      return;
    }
    validateKey(key);
  }, [searchParams, navigate]);

//     useEffect(() => {
//     const markdownString = `
// *Skimcard 01*
// *Classification of Solids (Based on Conductivity)*

// *Concept:*
// Solids can be sorted into three groups based on how easily they let an electric current pass through them. This property is measured by conductivity (σ) or its inverse, resistivity (ρ).

// *Key Information:*
// - *Metals:* Excellent conductors of electricity. They have very *low resistivity* and *high conductivity*.
//   - Example: Copper, Aluminium.
//   - Resistivity (ρ) ~ 10⁻² – 10⁻⁸ Ω m
// - *Insulators:* Very poor conductors of electricity. They have very *high resistivity* and *low conductivity*.
//   - Example: Wood, Plastic, Glass.
//   - Resistivity (ρ) ~ 10¹¹ – 10¹⁹ Ω m
// - *Semiconductors:* Their ability to conduct electricity is somewhere between metals and insulators.
//   - Example: Silicon (Si), Germanium (Ge).
//   - Resistivity (ρ) ~ 10⁻⁵ – 10⁶ Ω m

// *Insight:*
// Think of it like roads for traffic (current).
// - *Metals* are like an empty 8-lane highway. Traffic flows super fast with no resistance.
// - *Insulators* are like a road that is completely blocked by a traffic jam. No traffic can pass.
// - *Semiconductors* are like a normal city road with traffic signals. We can control how much traffic flows through it, which is why they are so useful in electronics.

// *Indian Example:*
// The copper wires used for electricity in our homes are *metals*. The plastic coating on those wires is an *insulator* to protect us from shock. The tiny chip inside your smartphone is made of a *semiconductor* like Silicon.

// *Can you answer below questions?*
// - What are the three types of solids based on conductivity?
//   - Metals, Insulators, and Semiconductors.
// - Which material has the lowest resistivity?
//   - Metals.
// - Give an example of an elemental semiconductor.
//   - Silicon (Si) or Germanium (Ge).

// *Questions to prepare for exam:*
// 1. Differentiate between metals, insulators, and semiconductors on the basis of their resistivity values. Give one example of each.
// 2. What are compound semiconductors? Provide two examples.

// ---

// *Skimcard 02*
// *Energy Bands in Solids*

// *Concept:*
// In a solid, electrons can't have just any random energy. Their energies are restricted to specific ranges called 'energy bands'. The two most important bands for conductivity are the Valence Band and the Conduction Band.

// *Key Information:*
// - *Valence Band (VB):* The lower energy band, which is almost completely filled with electrons. These electrons are tightly bound to their atoms and are not free to move.
// - *Conduction Band (CB):* The higher energy band, which is mostly empty. If an electron manages to jump into this band, it becomes free to move and conduct electricity.
// - *Energy Gap (Eg):* The energy difference between the top of the Valence Band and the bottom of the Conduction Band. The size of this gap determines if a solid is a metal, an insulator, or a semiconductor.
//   - *Metals:* The Valence and Conduction bands overlap. There is *no energy gap* (Eg ≈ 0). Electrons can move freely.
//   - *Insulators:* The energy gap is very large (*Eg > 3 eV*). It's almost impossible for an electron to jump from VB to CB.
//   - *Semiconductors:* The energy gap is small (*Eg < 3 eV*). A little energy (like heat) can make an electron jump from VB to CB.

// *Insight:*
// Imagine a multi-storey apartment building.
// - The *Valence Band* is the ground floor, where all the residents (electrons) live. They are inside their homes and not moving around the building.
// - The *Conduction Band* is the open terrace, where residents can run around freely.
// - The *Energy Gap* is the staircase connecting the ground floor to the terrace.
//   - In *metals*, there is no staircase; the ground floor and terrace are on the same level.
//   - In *insulators*, the staircase is broken and impossibly high to climb.
//   - In *semiconductors*, it's a short, manageable staircase that some energetic residents can climb.

// *Indian Example:*
// In a solar panel (made of silicon), the sun's heat and light provide the energy for electrons to climb the "staircase" from the Valence Band to the Conduction Band, which results in the flow of electric current.

// *Can you answer below questions?*
// - What are the two most important energy bands in a solid?
//   - Valence Band and Conduction Band.
// - What is the energy gap?
//   - The energy difference between the Valence Band and the Conduction Band.
// - Why are metals good conductors, based on energy band theory?
//   - Because their valence and conduction bands overlap, so there is no energy gap.

// *Questions to prepare for exam:*
// 1. Explain the formation of energy bands in solids. On this basis, explain the difference between conductors, semiconductors, and insulators.
// 2. The energy band gap for Germanium is 0.7 eV, and for Silicon is 1.1 eV. Which of the two is a better conductor at room temperature? Justify your answer.

// ---

// *Skimcard 03*
// *Intrinsic Semiconductor*

// *Concept:*
// An intrinsic semiconductor is a semiconductor in its *purest form*, without any added impurities. Its conductivity is naturally very low but increases with temperature.

// *Key Information:*
// - At absolute zero (0 K), it behaves like a perfect insulator.
// - At room temperature, heat energy causes some covalent bonds to break.
// - When a bond breaks, an electron is freed and jumps to the conduction band. This free electron can conduct electricity.
// - The vacancy left behind by the electron in the covalent bond is called a *hole*. A hole acts like a positive charge.
// - In an intrinsic semiconductor, the number of free electrons (*nₑ*) is always equal to the number of holes (*nₕ*).
// - This is represented as: *nₑ = nₕ = nᵢ* (where *nᵢ* is the intrinsic carrier concentration).
// - The total current is the sum of the current from electrons (*Iₑ*) and the current from holes (*Iₕ*).

// *Insight:*
// Think of a full classroom with students sitting on benches (covalent bonds). This is the semiconductor at 0 K. Now, the teacher (heat energy) asks one student (electron) to come to the front. That student is now free to walk around the class (conduct). The empty spot on the bench is the *hole*. Another student from a nearby bench can move into this empty spot, making it look like the empty spot itself has moved.

// *Indian Example:*
// Pure Silicon (Si) and Germanium (Ge) are the 'haldi' and 'dhaniya' of the electronics world – they are the basic, pure ingredients before we add any 'masala' (impurities).

// *Mnemonic:*
// *“Intrinsic is Innocent”* – It's pure, with no impurities added.

// *Can you answer below questions?*
// - What is an intrinsic semiconductor?
//   - A semiconductor in its purest form.
// - What happens when a covalent bond breaks in a semiconductor?
//   - A free electron and a hole are created.
// - What is the relationship between the number of electrons and holes in an intrinsic semiconductor?
//   - They are equal (nₑ = nₕ).

// *Questions to prepare for exam:*
// 1. Explain the mechanism of charge conduction in an intrinsic semiconductor. Draw its energy band diagram at T > 0K.
// 2. Why does the conductivity of an intrinsic semiconductor increase with a rise in temperature?

// ---

// *Skimcard 04*
// *Extrinsic Semiconductor & Doping*

// *Concept:*
// This is a pure semiconductor to which a small, controlled amount of a specific impurity has been added to drastically increase its conductivity. The process of adding impurities is called *doping*.

// *Key Information:*
// - *n-type Semiconductor:*
//   - Formed by doping with a *pentavalent* impurity (5 valence electrons), e.g., Phosphorus (P), Arsenic (As).
//   - Four electrons form bonds with Silicon, and the fifth electron is free to conduct.
//   - Majority carriers: *Electrons* (negative charge, hence n-type).
//   - Minority carriers: *Holes*.
//   - We have *nₑ >> nₕ*.
// - *p-type Semiconductor:*
//   - Formed by doping with a *trivalent* impurity (3 valence electrons), e.g., Boron (B), Aluminium (Al).
//   - The impurity atom can only form three bonds, leaving a vacancy or *hole*.
//   - Majority carriers: *Holes* (positive charge, hence p-type).
//   - Minority carriers: *Electrons*.
//   - We have *nₕ >> nₑ*.
// - *Important Relation:* In any semiconductor at thermal equilibrium, the product of electron and hole concentrations is constant: *nₑ * nₕ = nᵢ²*.

// *Insight:*
// Doping is like making tea. A pure semiconductor is just hot water (low conductivity).
// - To make *n-type* tea, you add a tea bag (pentavalent impurity), which releases lots of colour/flavour (electrons).
// - To make *p-type* tea, you add sugar cubes (trivalent impurity). Each cube dissolves, creating a "sweet spot" (hole) that makes the whole thing desirable.

// *Indian Example:*
// Think of a crowded bus in Delhi.
// - *n-type:* We push in a few extra people (electrons), who become the majority movers.
// - *p-type:* We create a few empty seats (holes). People will quickly shift to occupy them, making it seem like the empty seats are moving backwards through the bus.

// *Mnemonic:*
// *PAN* -> *P*hosphorus (or any *P*entavalent) makes *N*-type.
// *BAG* -> *B*oron, *A*luminium (or any trivalent) makes *p*-type (*G* is for Gallium, another trivalent dopant).

// *Can you answer below questions?*
// - What is doping?
//   - The process of adding impurities to a pure semiconductor to increase its conductivity.
// - What are the majority carriers in an n-type semiconductor?
//   - Electrons.
// - What kind of impurity is added to create a p-type semiconductor?
//   - A trivalent impurity (like Boron or Aluminium).

// *Questions to prepare for exam:*
// 1. What is an extrinsic semiconductor? Explain with the help of energy band diagrams how n-type and p-type semiconductors are formed.
// 2. A pure Si crystal has 5 × 10²⁸ atoms m⁻³. It is doped by 1 ppm concentration of pentavalent Arsenic. Calculate the number of electrons and holes. Given that nᵢ = 1.5 × 10¹⁶ m⁻³.

// ---

// *Skimcard 05*
// *The p-n Junction*

// *Concept:*
// A p-n junction is the interface formed by joining a p-type and an n-type semiconductor. This simple structure is the fundamental building block of most semiconductor devices, like diodes and transistors.

// *Key Information:*
// - *Formation:* When p-type and n-type materials are joined, two processes happen:
//   - *Diffusion:* Due to higher concentration, holes from the p-side move to the n-side, and electrons from the n-side move to the p-side. This creates a *diffusion current*.
//   - *Drift:* The diffusion leaves behind immobile charged ions near the junction (negative ions on the p-side, positive ions on the n-side). This creates an electric field. This field pushes minority carriers across the junction, creating a small *drift current*.
// - *Depletion Region:* The region near the junction which is depleted of free charge carriers (electrons and holes) and only contains immobile ions.
// - *Barrier Potential (V₀):* The electric field in the depletion region creates a potential difference that acts as a barrier, opposing further diffusion of majority carriers.
// - *Equilibrium:* A state is reached when the diffusion current exactly balances the drift current, and there is no net current flow across the junction.

// *Insight:*
// Imagine a hall divided by a screen. On one side, there are only boys (p-side, holes), and on the other, only girls (n-side, electrons). When you remove the screen (form the junction), some boys will naturally walk over to the girls' side and vice versa (*diffusion*). To stop the chaos, the organisers create a "no-go zone" in the middle (*depletion region*) and place guards (*electric field*) who prevent more people from crossing. This creates a *barrier*.

// *Indian Example:*
// You cannot create a p-n junction by simply pressing two pieces of p-type and n-type silicon together, just like you can't make a perfect dosa by just placing rice and dal next to each other on a pan. The junction must be formed on a single crystal structure through processes like diffusion at a microscopic level.

// *Can you answer below questions?*
// - What is the depletion region in a p-n junction?
//   - The region near the junction that is free of mobile charge carriers.
// - What is barrier potential?
//   - The potential difference created across the depletion region that opposes the flow of majority carriers.
// - What two currents are present during the formation of a p-n junction?
//   - Diffusion current and Drift current.

// *Questions to prepare for exam:*
// 1. Explain the formation of a depletion region and potential barrier in a p-n junction.
// 2. What is the difference between diffusion current and drift current in a semiconductor?

// ---

// *Skimcard 06*
// *p-n Junction Diode under Bias*

// *Concept:*
// Applying an external voltage to a p-n junction diode is called *biasing*. This allows us to control the current flowing through it. A diode essentially acts as a one-way street for current.

// *Key Information:*
// - *Forward Bias:*
//   - *Connection:* p-side is connected to the *positive* terminal of the battery, n-side to the *negative*.
//   - *Effect:* The external voltage opposes the barrier potential. The barrier height is reduced to *(V₀ - V)*.
//   - *Result:* The depletion region becomes *narrower*. It offers very *low resistance*, and a large current (in milliamperes, mA) flows.
// - *Reverse Bias:*
//   - *Connection:* p-side is connected to the *negative* terminal of the battery, n-side to the *positive*.
//   - *Effect:* The external voltage supports the barrier potential. The barrier height increases to *(V₀ + V)*.
//   - *Result:* The depletion region becomes *wider*. It offers very *high resistance*, and only a very tiny current (in microamperes, µA) due to minority carriers flows.

// *Insight:*
// Think of the depletion region as a gate.
// - *Forward Bias* is like pushing the gate *open*. The path becomes wide, and a huge crowd (current) can easily pass through.
// - *Reverse Bias* is like pushing the gate *closed* even more tightly. The path is blocked, and only one or two people (minority carriers) can sneak through a tiny gap.

// *Indian Example:*
// A diode acts like a valve in a water pipe or the security guard at a temple's 'Entry' gate. In *forward bias*, the guard lets everyone in. In *reverse bias*, he stops anyone from trying to exit through the entry gate, creating a one-way flow.

// *Mnemonic:*
// *PNP* -> *P*ositive terminal to *P*-side is forward bias.

// *Can you answer below questions?*
// - What is forward bias?
//   - Connecting the p-side to the positive terminal and the n-side to the negative terminal of a battery.
// - What happens to the width of the depletion region in reverse bias?
//   - It increases or becomes wider.
// - In which bias condition does a diode allow a large current to flow?
//   - Forward bias.

// *Questions to prepare for exam:*
// 1. Draw the V-I characteristic curve for a p-n junction diode. Explain the terms 'cut-in voltage' and 'reverse saturation current'.
// 2. Explain the working of a p-n junction diode under forward and reverse bias. How does the width of the depletion layer change in the two cases?

// ---

// *Skimcard 07*
// *Diode as a Rectifier*

// *Concept:*
// A rectifier is an electronic circuit that converts alternating current (AC) into direct current (DC). This is one of the most important applications of a p-n junction diode, which works because it only allows current to flow in one direction.

// *Key Information:*
// - *Half-Wave Rectifier:*
//   - Uses only *one diode*.
//   - It allows only one half (e.g., the positive half-cycle) of the AC input to pass through and blocks the other half.
//   - The output is a pulsating DC, but it is inefficient as half the input wave is wasted.
// - *Full-Wave Rectifier:*
//   - Uses *two diodes* (with a centre-tap transformer) or *four diodes* (in a bridge).
//   - It converts *both* halves of the AC input into a pulsating DC output.
//   - It is much more efficient than a half-wave rectifier.
// - *Filter Circuit:*
//   - To get a smooth DC output, a *capacitor* is connected in parallel with the load.
//   - The capacitor charges up during the peaks of the pulsating DC and then slowly discharges through the load, "filling in the gaps" and smoothing the output voltage.

// *Insight:*
// Think of rectifying AC as trying to make a crowd walk in a single file line.
// - *Half-Wave Rectifier* is a lazy guard who lets people pass for 10 seconds, then blocks the gate for the next 10 seconds. The flow is choppy.
// - *Full-Wave Rectifier* is a smart guard who directs people from two different gates into a single line, making the flow much more continuous.
// - The *Filter Capacitor* is like a supervisor who pushes people in the gaps to make the line perfectly smooth and continuous.

// *Indian Example:*
// Your mobile phone charger is the most common example of a rectifier. It takes the 220V AC from the wall socket in your house and uses a full-wave rectifier and a filter inside to convert it into the smooth 5V DC that your phone battery needs to charge.

// *Can you answer below questions?*
// - What is the main function of a rectifier?
//   - To convert AC into DC.
// - What is the main difference between a half-wave and a full-wave rectifier?
//   - A half-wave rectifier utilises only one half of the AC cycle, while a full-wave rectifier utilises both halves.
// - What component is used to smooth the output of a rectifier?
//   - A capacitor (as a filter).

// *Questions to prepare for exam:*
// 1. With the help of a neat circuit diagram, explain the working of a full-wave rectifier. Draw the input and output waveforms.
// 2. The input frequency of an AC signal is 50 Hz. What will be the output frequency if it is rectified by (a) a half-wave rectifier, and (b) a full-wave rectifier?

// `;
//     processMarkdown(markdownString);
//   }, []);

  // Measure front/back content and set the card height to the max so the card
  // container grows with content instead of having internal scroll.
  useLayoutEffect(() => {
    function updateHeight() {
      const frontH = frontContentRef.current?.scrollHeight || 0;
      const backH = backContentRef.current?.scrollHeight || 0;
      const skimH = skimcardRef.current?.offsetHeight || 0;
      const padding = 48; // approximate header+padding space
      const max = Math.max(frontH, backH, 240) + padding;
      setCardHeight(max);
      setSkimcardHeight(skimH);
    }

    updateHeight();

    const ro = new ResizeObserver(() => updateHeight());
  if (frontContentRef.current) ro.observe(frontContentRef.current);
  if (backContentRef.current) ro.observe(backContentRef.current);
  if (skimcardRef.current) ro.observe(skimcardRef.current);
    window.addEventListener("resize", updateHeight);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, [currentCardIndex, skimcards]);

  const handleCardClick = () => {
    if (!isDragging) {
      setIsFlipped(!isFlipped);
    }
  };

  const goToNextCard = () => {
    if (currentCardIndex < skimcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  const goToPrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  const onTouchStart = (e) => {
    const t = e.touches[0];
    touchStartX.current = t.clientX;
    touchStartY.current = t.clientY;
    touchEndX.current = t.clientX;
    touchEndY.current = t.clientY;
    setIsDragging(false);
  };

const onTouchMove = (e) => {
  const t = e.touches[0];
  const currentY = t.clientY;
  touchEndY.current = currentY;
  const deltaY = currentY - touchStartY.current;
  const deltaX = t.clientX - touchStartX.current;

  // Only treat as vertical drag if vertical movement sufficiently dominates horizontal
  if (Math.abs(deltaY) > 10 && Math.abs(deltaY) > Math.abs(deltaX) * 1.2) {
    e.preventDefault(); // ✅ Prevent native scroll during valid swipe
    setIsDragging(true);
    setDragOffset(deltaY);
  }
};

const onTouchEnd = () => {
  const deltaY = touchEndY.current - touchStartY.current;
  const deltaX = touchEndX.current - touchStartX.current;
  const threshold = 0;

  // Only consider vertical swipes when vertical movement sufficiently dominates horizontal
  if (Math.abs(deltaY) > Math.abs(deltaX) * 1.2) {
    if (deltaY < -threshold && currentCardIndex < skimcards.length - 1) {
      goToNextCard(); // swipe up → next card
    } else if (deltaY > threshold && currentCardIndex > 0) {
      goToPrevCard(); // swipe down → previous card
    }
  }

  setDragOffset(0);
  setIsDragging(false);
};


  const onMouseDown = (e) => {
    touchStartX.current = e.clientX;
    touchStartY.current = e.clientY || 0;
    touchEndX.current = e.clientX;
    touchEndY.current = e.clientY || 0;
    setIsDragging(false);
  };

const onMouseMove = (e) => {
  if (e.buttons !== 1) return; // ✅ Only track if mouse button is pressed
  
  const currentY = e.clientY || 0;
  touchEndY.current = currentY;
  const deltaY = currentY - touchStartY.current;
  const deltaX = e.clientX - touchStartX.current;

  if (Math.abs(deltaY) > 10 && Math.abs(deltaY) > Math.abs(deltaX) * 1.2) {
    e.preventDefault();
    setIsDragging(true);
    setDragOffset(deltaY);
  }
};

const onMouseUp = () => {
  const deltaY = touchEndY.current - touchStartY.current;
  const deltaX = touchEndX.current - touchStartX.current;
  const threshold = 40;

  if (Math.abs(deltaY) > Math.abs(deltaX) * 1.2) {
    if (deltaY < -threshold && currentCardIndex < skimcards.length - 1) {
      goToNextCard(); // swipe up → next card
    } else if (deltaY > threshold && currentCardIndex > 0) {
      goToPrevCard(); // swipe down → previous card
    }
  }

  setDragOffset(0);
  setIsDragging(false);
};


  const onMouseLeave = () => {
    if (isDragging) {
      setDragOffset(0);
      setIsDragging(false);
      // reset refs used for tracking
      touchStartX.current = 0;
      touchStartY.current = 0;
      touchEndX.current = 0;
      touchEndY.current = 0;
    }
  };

  return (
    <div id="answer-preview">
  <div className="container-fluid">
        {loading ? (
          <p style={{ textAlign: "center", margin: "auto", color: '#4b5563' }}>Loading ....</p>
        ) : message ? (
          <p style={{ textAlign: "center", margin: "auto", color: '#dc2626' }}>{message}</p>
        ) : (
          <>
            <div className="user-details" style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
                {userData?.type?.toUpperCase()}
              </h2>
              <p className="subject-details" style={{ color: '#4b5563' }}>
                {userData?.class_name} | {userData?.subject_name} |{" "}
                {userData?.chapter_name}
              </p>
            </div>

            {skimcards && skimcards.length > 0 && (
              <>
                {/* Card Container */}
                <div className="card-stage">
                  {/* Swipe instruction overlay */}
{currentCardIndex === 0 && !isDragging && (
  <div className="swipe-overlay">👆 Tap to flip • ☝️👆 Swipe up/down to navigate</div>
)}


{/* Card with swipe effect */}
<div
  className={`card-drag-wrapper ${isDragging ? 'dragging' : ''}`}  // ✅ New version with dynamic class
  style={{
    transform: `translateY(${dragOffset}px)`,
    transition: isDragging ? 'none' : 'transform 0.3s ease-out',
    opacity: isDragging ? 0.8 : 1,
    cursor: isDragging ? 'grabbing' : 'grab'
  }}
  onClick={handleCardClick}
  onTouchStart={onTouchStart}
  onTouchMove={onTouchMove}
  onTouchEnd={onTouchEnd}
  onMouseDown={onMouseDown}
  onMouseMove={onMouseMove}
  onMouseUp={onMouseUp}
  onMouseLeave={onMouseLeave}
>
                    <div
                      className="skimcard-3d"
                      style={{
                        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
                        height: cardHeight ? `${cardHeight}px` : 'auto'
                      }}
                    >
                      {/* Front of Card */}
                      <div className="card card-front">
                        <div className="card-header">
                          <span className="card-badge">Skimcard {skimcards[currentCardIndex].num}</span>
                          <span className="card-action">Tap to flip</span>
                        </div>
                        <div className="card-body" ref={frontContentRef} dangerouslySetInnerHTML={{ __html: skimcards[currentCardIndex].front }} />
                      </div>

                      {/* Back of Card */}
                      <div className="card card-back">
                        <div className="card-header card-header-back">
                          <span className="card-badge card-badge-light">Questions</span>
                          <span className="card-action card-action-back">Tap to flip back</span>
                        </div>
                        <div className="card-body card-body-back" ref={backContentRef} dangerouslySetInnerHTML={{ __html: skimcards[currentCardIndex].back }} />
                      </div>
                    </div>
                  </div>

                  {/* Swipe indicator arrows */}
                  {isDragging && (
                    <>
                      {dragOffset < -50 && currentCardIndex < skimcards.length - 1 && (
                        <div style={{ position: 'absolute', left: '50%', top: '0.5rem', transform: 'translateX(-50%)', color: '#4f46e5', fontSize: '2.25rem', animation: 'bounce 1s infinite', pointerEvents: 'none' }}>
                          ▲
                        </div>
                      )}
                      {dragOffset > 50 && currentCardIndex > 0 && (
                        <div style={{ position: 'absolute', left: '50%', bottom: '0.5rem', transform: 'translateX(-50%)', color: '#4f46e5', fontSize: '2.25rem', animation: 'bounce 1s infinite', pointerEvents: 'none' }}>
                          ▼
                        </div>
                      )}
                    </>
                  )}
                  {/* Progress Indicator */}
                  <div className="progress-indicator">
                    {skimcards.map((card, index) => (
                      <button
                        key={card.id}
                        onClick={() => {
                          setCurrentCardIndex(index);
                          setIsFlipped(false);
                        }}
                        className={`progress-btn ${index === currentCardIndex ? 'active' : ''}`}
                      >
                        {card.num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Counter */}
                {/* <p className="card-counter">Card {currentCardIndex + 1} of {skimcards.length}</p> */}

                {/* Instructions */}
                {/* <div className="instructions-box">
                  <p>
                    <span className="hint-title">💡 How to use:</span><br/>
                    <span className="hint-body">
                      <strong>Tap</strong> the card to see questions
<strong> • Swipe left/right</strong> to navigate
                      <strong> • Click numbers</strong> to jump to any card
                    </span>
                  </p>
                </div> */}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}