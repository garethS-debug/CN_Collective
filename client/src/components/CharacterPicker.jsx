"use client"

import { AnimatePresence, motion, usePresenceData, wrap } from "motion/react"
import { forwardRef, useState } from "react"
import Characters from "./Characters"

export default function UsePresenceData() {
    const characters = Characters
    const [index, setIndex] = useState(0)
    const [direction, setDirection] = useState(1)

    function setSlide(newDirection) {
        const nextIndex = wrap(0, characters.length, index + newDirection)
        setIndex(nextIndex)
        setDirection(newDirection)
    }

    const current = characters[index]
    const color = current?.color || `var(--hue-${index + 1})`

    return (
        <div style={container}>
            <motion.button
                initial={false}
                animate={{ backgroundColor: color }}
                aria-label="Previous"
                style={button}
                onClick={() => setSlide(-1)}
                whileFocus={{ outline: `2px solid ${color}` }}
                whileTap={{ scale: 0.9 }}
            >
                <ArrowLeft />
            </motion.button>
            <AnimatePresence
                custom={direction}
                initial={false}
                mode="popLayout"
            >
                <Slide key={current?.id ?? index} character={current} />
            </AnimatePresence>
            <motion.button
                initial={false}
                animate={{ backgroundColor: color }}
                aria-label="Next"
                style={button}
                onClick={() => setSlide(1)}
                whileFocus={{ outline: `2px solid ${color}` }}
                whileTap={{ scale: 0.9 }}
            >
                <ArrowRight />
            </motion.button>
        </div>
    )
}

const Slide = forwardRef(function Slide({ character }, ref) {
    const direction = usePresenceData()
    const color = character?.color
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x: direction * 50 }}
            animate={{
                opacity: 1,
                x: 0,
                transition: {
                    delay: 0.2,
                    type: "spring",
                    visualDuration: 0.3,
                    bounce: 0.4,
                },
            }}
            exit={{ opacity: 0, x: direction * -50 }}
            style={{ ...box, backgroundColor: color }}
        >
            {character?.image && (
                <img
                    src={character.image}
                    alt={character.name}
                    style={{ width: '80%', height: '60%', objectFit: 'cover', borderRadius: 8 }}
                />
            )}
            <div style={{ marginTop: 8, fontWeight: 'bold' }}>{character?.name}</div>
            <div style={{ fontSize: 12, color: '#333' }}>{character?.description}</div>
        </motion.div>
    )
})

/**
 * ==============   Icons   ================
 */
const iconsProps = {
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
}

function ArrowLeft() {
    return (
        <svg {...iconsProps}>
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
        </svg>
    )
}

function ArrowRight() {
    return (
        <svg {...iconsProps}>
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    )
}

/**
 * ==============   Styles   ================
 */

const container = {
    display: "flex",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
}

const box = {
    width: 150,
    height: 150,
    backgroundColor: "#0cdcf7",
    borderRadius: "10px",
}

const button = {
    backgroundColor: "#0cdcf7",
    width: 40,
    height: 40,
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    zIndex: 1,
    outlineOffset: 2,
}