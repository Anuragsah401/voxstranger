import React, { useEffect, useRef } from "react";

/**
 * @typedef {Object} AudioVisualizerProps
 * @property {MediaStream|null} stream
 * @property {string} color
 * @property {boolean} [simulate]
 */

const AudioVisualizer = ({ stream, color, simulate = false }) => {
  const canvasRef = useRef(null);
  // Fix: Added null as initial value for useRef to satisfy the requirement of 1 argument
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let analyzer = null;
    let dataArray = null;
    let audioContext = null;

    if (stream && !simulate) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      analyzer = audioContext.createAnalyser();
      analyzer.fftSize = 256;
      source.connect(analyzer);
      const bufferLength = analyzer.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
    }

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = width / 2 - 10;

      ctx.clearRect(0, 0, width, height);

      let values = [];
      if (simulate) {
        // Simulate voice patterns
        const time = Date.now() / 400;
        for (let i = 0; i < 32; i++) {
          const val = Math.sin(time + i * 0.5) * 20 + Math.random() * 10 + 30;
          values.push(val);
        }
      } else if (analyzer && dataArray) {
        analyzer.getByteFrequencyData(dataArray);
        // Take a slice of the frequencies
        for (let i = 0; i < 32; i++) {
          values.push((dataArray[i * 2] / 255) * 80);
        }
      } else {
        values = new Array(32).fill(2);
      }

      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.lineCap = "round";

      for (let i = 0; i < 32; i++) {
        const angle = (i / 32) * Math.PI * 2;
        const value = values[i] || 2;

        const x1 = centerX + Math.cos(angle) * (radius - value / 2);
        const y1 = centerY + Math.sin(angle) * (radius - value / 2);
        const x2 = centerX + Math.cos(angle) * (radius + value / 2);
        const y2 = centerY + Math.sin(angle) * (radius + value / 2);

        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
      }
      ctx.stroke();

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      // Fix: Check if animationRef.current is not null before canceling to avoid TS error
      if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
      if (audioContext) audioContext.close();
    };
  }, [stream, color, simulate]);

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={300}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-80"
    />
  );
};

export default AudioVisualizer;
