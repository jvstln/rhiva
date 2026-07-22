import { useState, useRef } from "react";
import { Draggable, gsap, useGSAP } from "@/lib/gsap.util";
import { Sparkles } from "lucide-react";
import {
  createDialogHandle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { mergeProps, useRender } from "@base-ui/react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { toast } from "sonner";

type Reward = {
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

function pickWeightedIndex() {
  const total = REWARDS.reduce((sum, r) => sum + r.weight, 0);
  let rand = Math.random() * total;
  for (let i = 0; i < REWARDS.length; i++) {
    rand -= REWARDS[i].weight;
    if (rand <= 0) return i;
  }
  return 0;
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

  // Positioning animation
  useGSAP(() => {
    const cardTransform = getCardTransform({ index, total: totalCards });

    gsap.to(internalRef.current, {
      ...cardTransform,
      scale: 1,
      ease: "power2.out",
    });
  });

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
        className: cn("scale-60 w-40.5 h-57", className),
        children: (
          <div
            className="card-flip-inner size-full relative perspective-midrange"
            style={{
              transformStyle: "preserve-3d",
              transition: "transform 0.7s cubic-bezier(.2,.8,.2,1)",
              transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* BACK FACE */}
            <Image
              src={"/reward-tiers/reward-card-back.svg"}
              alt="Back of reward card"
              fill
              className="flex flex-col items-center justify-center rounded-xl object-cover border backface-hidden inset-shadow-md"
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
              className="flex flex-col items-center justify-center rounded-xl object-cover border backface-hidden inset-shadow-md"
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
type ClaimRewardsDialogProps = Dialog.Props & { children?: React.ReactElement };

export const ClaimRewardsDialog = ({
  children = (
    <Button
      style={{
        background: "linear-gradient(160deg, #E3B872, #B47B2E)",
        color: "#1A1208",
        boxShadow: "0 10px 26px rgba(180,123,46,0.3)",
      }}
    >
      <Sparkles />
      Open reward vault
    </Button>
  ),
  ...props
}: ClaimRewardsDialogProps) => {
  const [claimedItem, setClaimedItem] = useState<Reward | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardContainerRef = useRef<HTMLDivElement | null>(null);

  const { contextSafe } = useGSAP();

  const triggerPickAnimation = contextSafe(() => {
    setIsShuffling(true);
    const tl = gsap.timeline();
    const RAISE_Y = -20; // shared delta so every raise has an exact matching return

    // Pick a card
    const pickedIndex = pickWeightedIndex();
    const loops = 3; // how many full passes through the deck before landing
    const totalTicks = loops * cardRefs.current.length + pickedIndex;

    let prevCard: HTMLElement | null = null;

    for (let i = 0; i <= totalTicks; i++) {
      const cardIndex = i % cardRefs.current.length;
      const card = cardRefs.current[cardIndex];
      const isFinal = i === totalTicks;

      // ease the delay: quick early on, slower as we approach the winner
      const t = i / totalTicks;
      const delay = 0.05 + 0.18 * Math.pow(t, 2.2);

      // return the previously-highlighted card to rest, exactly undoing the raise
      if (prevCard && prevCard !== card) {
        tl.to(
          prevCard,
          {
            scale: 1,
            y: `-=${RAISE_Y}`,
            duration: 0.15,
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
            duration: 0.15,
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
            duration: 0.55,
            ease: "back.out(1.6)",
            overwrite: "auto",
            onComplete() {
              setClaimedItem(REWARDS[cardIndex]);
              setIsShuffling(false);
            },
          },
          prevCard && prevCard !== card ? "<" : `+=${delay}`,
        ).to(
          cardRefs.current.filter((c) => c !== card),
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

  return (
    <Dialog
      {...props}
      onOpenChange={(...args) => {
        props.onOpenChange?.(...args);
        if (args[0] === false) {
          setClaimedItem(null);
        }
      }}
      handle={claimRewardsDialogHandle}
    >
      {children && <DialogTrigger render={children} />}
      <DialogContent
        className="sm:max-w-3xl min-h-[80vh]  flex flex-col"
        style={{
          backgroundImage:
            "radial-gradient(circle at 80% 0, rgb(255 255 255 / 0.1), transparent 60%)",
        }}
      >
        <DialogHeader>
          {claimedItem && <DialogDescription>Your pull</DialogDescription>}
          <DialogTitle>
            {claimedItem
              ? `${claimedItem.name} - ${claimedItem.value}`
              : "Claim your gift"}
          </DialogTitle>
        </DialogHeader>

        <div className="relative h-60 grow flex items-center justify-center">
          {REWARDS.map((reward, index, arr) => (
            <Card
              key={reward.name}
              index={index}
              totalCards={arr.length}
              reward={reward}
              className="absolute"
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              animationDisabled={isShuffling || !!claimedItem}
              flipped={claimedItem?.name === reward.name}
            />
          ))}
        </div>
        <p
          className={cn(
            "text-amber-100 transition text-center invisible",
            claimedItem && "visible",
          )}
        >
          {claimedItem?.desc}
        </p>
        <Button
          size="lg"
          className={cn(
            "rounded-full mx-auto invisible w-32 transition-none shadow-2xl",
            claimedItem && "visible",
          )}
          style={{ background: "linear-gradient(160deg, #E3B872, #B47B2E)" }}
          onClick={async () => {
            await burst(cardContainerRef.current);
            toast.success("Reward claimed!", {
              description: `${claimedItem?.value} has been added to your balance!`,
            });
            claimRewardsDialogHandle.close();
          }}
        >
          <Sparkles /> Claim
        </Button>
        {!claimedItem && !isShuffling && (
          <DraggableLever
            onTrigger={triggerPickAnimation}
            disabled={isShuffling || !!claimedItem}
            className="w-4/5 mx-auto"
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

type DraggableLeverProps = {
  disabled?: boolean;
  onTrigger?: () => void;
  className?: string;
};

export const DraggableLever = ({
  disabled,
  onTrigger,
  className,
}: DraggableLeverProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const boundsRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const trackProgress = (x: number) => {
        gsap.set(containerRef.current, {
          "--drag-progress-width": `${x + 4}px`,
        });
      };

      const draggable = Draggable.create("[data-draggable-trigger]", {
        bounds: "[data-draggable-bounds]",
        liveSnap: {
          x: (x) => {
            trackProgress(x);
            return x;
          },
        },
        onClick() {
          onTrigger?.();
        },
        onDragEnd: function () {
          let x = 0;
          if (this.maxX && this.x > this.maxX * 0.4) x = this.maxX;

          gsap.to(this.target, {
            x,
            duration: 0.5,
            ease: "elastic.out(1,0.55)",
            onUpdate: () => trackProgress(x),
            onComplete: () => {
              if (x > 0) onTrigger?.();
            },
          });
        },
      });

      if (disabled) {
        draggable.map((d) => d.disable());
      }
    },
    { scope: containerRef, dependencies: [disabled] },
  );

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative grow-0 flex items-center rounded-full border p-1 overflow-hidden",
        disabled && "pointer-events-none transition opacity-45",
        className,
      )}
    >
      <span
        className="pointer-events-none select-none absolute flex justify-center items-center inset-0 left-4 text-center font-mono text-xs tracking-widest uppercase text-[#9C96A8]"
        data-draggable-text
      >
        Drag or tap to pull
      </span>

      <div
        ref={boundsRef}
        className={cn(
          "size-full",
          "before:h-full before:w-(--drag-progress-width) before:absolute before:top-0 before:left-0 min-w-4 before:bg-background",
        )}
        data-draggable-bounds
      >
        <Button
          size="icon-lg"
          className="rounded-full transition-none shadow-lg"
          style={{ background: "linear-gradient(160deg, #E3B872, #B47B2E)" }}
          data-draggable-trigger
        >
          <Sparkles />
        </Button>
      </div>
    </div>
  );
};
