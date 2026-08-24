import Image from "next/image";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { mergeProps, useRender } from "@base-ui/react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { gsap, useGSAP } from "@/lib/gsap.util";
import {
  createDialogHandle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export type Reward = {
  name: string;
  image: string;
  value: string;
  desc: string;
  weight: number; // Probability of appearing
};

const REWARDS: Reward[] = [
  {
    image: "/reward-tiers/reward-card-1.svg",
    name: "Bronze",
    value: "$1",
    desc: "A fragment that still holds forge-heat. Fuels one upgrade of your choice.",
    weight: 1,
  },
  {
    image: "/reward-tiers/reward-card-2.svg",
    name: "Gold",
    value: "$2",
    desc: "240 gold, no strings attached.",
    weight: 1,
  },
  {
    image: "/reward-tiers/reward-card-5.svg",
    name: "Emrald",
    value: "$5",
    desc: "Grants passage through the outer wards for one full cycle.",
    weight: 1,
  },
  {
    image: "/reward-tiers/reward-card-10.svg",
    name: "Ruby",
    value: "$10",
    desc: "Once worn by a ruler who never lost a siege.",
    weight: 1,
  },
  {
    image: "/reward-tiers/reward-card-20.svg",
    name: "Platinium",
    value: "$20",
    desc: "One in ten thousand. Nobody quite agrees what it does.",
    weight: 1,
  },
  {
    image: "/reward-tiers/reward-card-100.svg",
    name: "Black",
    value: "$100",
    desc: "Unhittable jackpot. You must be a hacker.",
    weight: 1,
  },
];

const CARD_BACK_IMAGE = "/reward-tiers/reward-card-back.svg";
const CARD_PATTERN_IMAGE = "/reward-tiers/card-pattern.svg";

const GOLD_STYLE = {
  background: "linear-gradient(160deg, #E3B872, #B47B2E)",
} as const;

function pickWeightedIndex(pool: Reward[]) {
  const total = pool.reduce((sum, r) => sum + r.weight, 0);
  let rand = Math.random() * total;
  for (let i = 0; i < pool.length; i++) {
    rand -= pool[i].weight;
    if (rand <= 0) return i;
  }
  return 0;
}

function getRewardValue(reward: Reward) {
  return Number(reward.value.replace("$", ""));
}

async function burst(container: HTMLElement | null, count = 26) {
  if (!container) return;
  const animations = [];

  for (let i = 0; i < count; i++) {
    const el = document.createElement("span");
    const isSpark = i % 3 === 0;
    el.style.position = "absolute";
    el.style.left = "50%";
    el.style.top = "45%";
    el.style.width = isSpark ? "3px" : "6px";
    el.style.height = isSpark ? "10px" : "6px";
    el.style.borderRadius = isSpark ? "2px" : "999px";
    el.style.background = "var(--color-primary)";
    el.style.boxShadow = `0 0 8px var(--color-primary)`;
    el.style.pointerEvents = "none";
    el.style.willChange = "transform, opacity";
    container.appendChild(el);

    const angle = Math.random() * Math.PI * 2;
    const dist = 50 + Math.random() * 140;
    animations.push(
      gsap.fromTo(
        el,
        {
          x: 0,
          y: 0,
          opacity: 1,
          scale: 0.5 + Math.random() * 0.9,
          rotate: Math.random() * 180,
        },
        {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist - 30,
          opacity: 0,
          duration: 0.8 + Math.random() * 0.6,
          ease: "power2.out",
          onComplete: () => el.remove(),
        },
      ),
    );
  }

  return Promise.all(animations);
}

/* ------------------------------------------------------------------ */
/*  CARD                                                                */
/* ------------------------------------------------------------------ */

function getCardTransform({
  index,
  total,
  radius = 400, // arc radius — bigger = flatter fan
  maxAngle = 25, // degrees the outermost card tilts
  overlap = 0.6, // 0-1, how much cards can overlap when packed tight
}: {
  index: number;
  total: number;
  radius?: number;
  maxAngle?: number;
  overlap?: number;
}) {
  const mid = (total - 1) / 2;
  const t = total > 1 ? (index - mid) / mid : 0;

  const angle = t * maxAngle; // degrees
  const rad = angle * (Math.PI / 180);

  // shrink radius as card count grows past a threshold, to allow controlled overlap
  const packedRadius = Math.max(
    radius * overlap,
    radius / Math.max(1, total / 6),
  );

  return {
    x: packedRadius * Math.sin(rad),
    y: -packedRadius * Math.cos(rad) + packedRadius,
    rotate: angle,
    zIndex: index, // keeps stacking order left-to-right as later cards sit on top
  };
}

type CardProps = useRender.ComponentProps<"div"> & {
  reward: Reward;
  index: number;
  totalCards: number;
  animationDisabled?: boolean;
  flipped?: boolean;
};

const Card = function Card({
  reward,
  index,
  totalCards,
  className,
  animationDisabled,
  flipped,
  ...props
}: CardProps) {
  const internalRef = useRef<HTMLDivElement | null>(null);

  // Positioning animation — re-runs when the fan shape changes
  useGSAP(
    () => {
      const cardTransform = getCardTransform({ index, total: totalCards });

      gsap.to(internalRef.current, {
        ...cardTransform,
        scale: 1,
        ease: "power2.out",
      });
    },
    { dependencies: [index, totalCards] },
  );

  // Bop animation
  useGSAP(
    () => {
      if (!animationDisabled) {
        gsap.to(internalRef.current, {
          y: `+=6`,
          duration: 1.6 + index * 0.15,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.12,
        });
      }
    },
    { dependencies: [animationDisabled] },
  );

  return useRender({
    defaultTagName: "div",
    ref: internalRef,
    state: { index },
    props: mergeProps(
      {
        className: cn("h-57 w-40.5 scale-60", className),
        children: (
          <div
            className="card-flip-inner perspective-midrange relative size-full"
            style={{
              transformStyle: "preserve-3d",
              transition: "transform 0.45s cubic-bezier(.2,.8,.2,1)",
              transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* BACK FACE */}
            <Image
              src={CARD_BACK_IMAGE}
              alt="Back of reward card"
              fill
              unoptimized
              className="backface-hidden inset-shadow-md flex flex-col items-center justify-center rounded-xl border object-cover"
              style={{
                background:
                  "repeating-linear-gradient(135deg, #171320 0px, #171320 8px, #1c1826 8px, #1c1826 16px)",
              }}
            />

            {/* FRONT FACE (revealed) */}
            <Image
              src={reward.image}
              alt="Back of reward card"
              fill
              unoptimized
              className="backface-hidden inset-shadow-md flex flex-col items-center justify-center rounded-xl border object-cover"
              style={{
                background:
                  "repeating-linear-gradient(135deg, #171320 0px, #171320 8px, #1c1826 8px, #1c1826 16px)",
                transform: "rotateY(180deg)",
              }}
            />
          </div>
        ),
      },
      props,
    ),
  });
};

const claimRewardsDialogHandle = createDialogHandle();

type Phase = "idle" | "shuffling" | "revealed" | "summary";

type ClaimRewardsDialogProps = Dialog.Props & {
  children?: React.ReactElement;
  /** How many card draws the user has pending. Defaults to 1. */
  draws?: number;
  /** Called with every drawn reward once the user claims them all. */
  onClaim?: (rewards: Reward[]) => void | Promise<void>;
};

export const ClaimRewardsDialog = ({
  children = (
    <Button
      style={{
        ...GOLD_STYLE,
        color: "#1A1208",
        boxShadow: "0 10px 26px rgba(180,123,46,0.3)",
      }}
      data-require-auth
    >
      <Sparkles />
      Open reward vault
    </Button>
  ),
  draws = 1,
  onClaim,
  ...props
}: ClaimRewardsDialogProps) => {
  const [phase, setPhase] = useState<Phase>("idle");
  const [won, setWon] = useState<Reward[]>([]);
  const [current, setCurrent] = useState<Reward | null>(null);
  const cardContainerRef = useRef<HTMLDivElement | null>(null);

  // Keyed by reward name so the deck can shrink as rewards are drawn
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const { contextSafe } = useGSAP();

  // Warm the browser cache for every card face as soon as the trigger mounts,
  // so nothing pops in late when the dialog opens
  useEffect(() => {
    for (const src of [
      CARD_BACK_IMAGE,
      CARD_PATTERN_IMAGE,
      ...REWARDS.map((reward) => reward.image),
    ]) {
      const img = new window.Image();
      img.src = src;
    }
  }, []);

  const pool = REWARDS.filter(
    (reward) => !won.some((w) => w.name === reward.name),
  );
  const drawsLeft = draws - won.length - (phase === "revealed" ? 1 : 0);
  const deckDone = pool.length === 0;
  const displayedRewards = phase === "summary" || deckDone ? won : pool;

  const triggerPickAnimation = contextSafe(() => {
    if (pool.length === 0 || phase !== "idle") return;

    setPhase("shuffling");
    const tl = gsap.timeline();
    const RAISE_Y = -20; // shared delta so every raise has an exact matching return

    // Pick a card
    const pickedIndex = pickWeightedIndex(pool);
    const cards = pool
      .map((reward) => cardRefs.current[reward.name])
      .filter((card): card is HTMLDivElement => !!card);
    const loops = 3; // how many full passes through the deck before landing
    const totalTicks = loops * cards.length + pickedIndex;

    let prevCard: HTMLElement | null = null;

    for (let i = 0; i <= totalTicks; i++) {
      const cardIndex = i % cards.length;
      const card = cards[cardIndex];
      const isFinal = i === totalTicks;

      // ease the delay: quick early on, slower as we approach the winner
      const t = i / totalTicks;
      const delay = 0.03 + 0.11 * Math.pow(t, 2.2);

      // return the previously-highlighted card to rest, exactly undoing the raise
      if (prevCard && prevCard !== card) {
        tl.to(
          prevCard,
          {
            scale: 1,
            y: `-=${RAISE_Y}`,
            duration: 0.12,
            ease: "power1.out",
            overwrite: "auto",
          },
          `+=${delay}`,
        );
      }

      if (!isFinal) {
        tl.to(
          card,
          {
            scale: 1.12,
            y: `+=${RAISE_Y}`,
            duration: 0.12,
            ease: "power1.out",
            overwrite: "auto",
          },
          prevCard && prevCard !== card ? "<" : `+=${delay}`,
        );
      } else {
        // final card lands from its resting position straight to center stage,
        // so this stays an absolute move (it's a fixed layout position, not a highlight step)
        tl.to(
          card,
          {
            x: 0,
            y: -10,
            rotate: 0,
            scale: 1.8,
            zIndex: 100,
            duration: 0.42,
            ease: "back.out(1.6)",
            overwrite: "auto",
            onComplete() {
              setCurrent(pool[pickedIndex]);
              setPhase("revealed");
            },
          },
          prevCard && prevCard !== card ? "<" : `+=${delay}`,
        ).to(
          cards.filter((c) => c !== card),
          {
            rotateX: "-60deg",
            autoAlpha: 0,
          },
          "<",
        );
      }

      prevCard = card;
    }
  });

  const handleContinue = contextSafe(() => {
    if (!current) return;

    const nextWon = [...won, current];

    // Clean leftover reveal styles off the surviving deck cards so they can re-fan
    for (const reward of REWARDS) {
      if (reward.name === current.name) continue;
      const el = cardRefs.current[reward.name];
      if (el) gsap.set(el, { clearProps: "all" });
    }

    const isLastDraw =
      nextWon.length >= draws || REWARDS.length - nextWon.length === 0;

    setWon(nextWon);
    setCurrent(null);
    setPhase(isLastDraw ? "summary" : "idle");
  });

  const handleClaim = async () => {
    await burst(cardContainerRef.current);
    const total = won.reduce((sum, reward) => sum + getRewardValue(reward), 0);
    toast.success("Reward claimed!", {
      description: `$${total} has been added to your balance!`,
    });
    await onClaim?.(won);
    claimRewardsDialogHandle.close();
  };

  const reset = () => {
    setWon([]);
    setCurrent(null);
    setPhase("idle");
  };

  return (
    <Dialog
      {...props}
      onOpenChange={(...args) => {
        props.onOpenChange?.(...args);
        if (args[0] === false) reset();
      }}
      handle={claimRewardsDialogHandle}
    >
      {children && <DialogTrigger render={children} />}
      <DialogContent
        className="flex min-h-[80vh] flex-col sm:max-w-3xl"
        style={{
          backgroundImage:
            "radial-gradient(circle at 80% 0, rgb(255 255 255 / 0.1), transparent 60%), url(/reward-tiers/card-pattern.svg)",
          backgroundSize: "auto, 160px",
        }}
      >
        <DialogHeader>
          {phase === "revealed" && (
            <DialogDescription>Your pull</DialogDescription>
          )}
          {phase === "idle" && drawsLeft > 1 && (
            <DialogDescription>{drawsLeft} draws left</DialogDescription>
          )}
          {(phase === "summary" || (phase === "idle" && deckDone)) && (
            <DialogDescription>All draws complete</DialogDescription>
          )}
          <DialogTitle>
            {phase === "revealed" && current
              ? `${current.name} - ${current.value}`
              : phase === "summary"
                ? "Your rewards"
                : "Claim your gift"}
          </DialogTitle>
        </DialogHeader>

        <div className="relative flex h-60 grow items-center justify-center">
          {displayedRewards.map((reward, index, arr) => (
            <Card
              key={reward.name}
              index={index}
              totalCards={arr.length}
              reward={reward}
              className="absolute"
              ref={(el) => {
                cardRefs.current[reward.name] = el;
              }}
              animationDisabled={phase !== "idle"}
              flipped={
                phase === "summary" ||
                (phase === "revealed" && current?.name === reward.name)
              }
            />
          ))}
        </div>

        {phase === "revealed" && current && (
          <p className="text-center text-amber-100">{current.desc}</p>
        )}

        {phase === "idle" && !deckDone && (
          <div className="relative mx-auto w-fit">
            <span
              aria-hidden
              className="absolute inset-0 animate-[ping_1.6s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full opacity-50"
              style={GOLD_STYLE}
            />
            <Button
              size="lg"
              className="relative w-64 rounded-full text-base shadow-2xl transition-none"
              style={GOLD_STYLE}
              onClick={triggerPickAnimation}
            >
              <Sparkles className="size-5" /> Pull
            </Button>
          </div>
        )}

        {phase === "revealed" && (
          <Button
            size="lg"
            className="mx-auto w-44 rounded-full shadow-2xl transition-none"
            style={GOLD_STYLE}
            onClick={handleContinue}
          >
            {drawsLeft > 0 ? `Pull again (${drawsLeft} left)` : "See results"}
          </Button>
        )}

        {phase === "summary" && (
          <Button
            size="lg"
            className="mx-auto w-32 rounded-full shadow-2xl transition-none"
            style={GOLD_STYLE}
            onClick={handleClaim}
          >
            <Sparkles /> Claim
          </Button>
        )}

        {phase !== "summary" && drawsLeft > 0 && (
          <span className="absolute bottom-4 left-4 font-medium text-amber-200/70 text-xs">
            {drawsLeft} {drawsLeft === 1 ? "pull" : "pulls"} left
          </span>
        )}
      </DialogContent>
    </Dialog>
  );
};
