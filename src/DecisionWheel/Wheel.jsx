/**
 * Wheel — SVG visualisation for the Decision Wheel.
 *
 * Draws one equal-size slice per option (equal probability per the spec),
 * each with a distinct colour and its label. A fixed pointer/arrow at the
 * top marks the winning position. The component is presentational and
 * derives everything from the `options` prop, so it updates reactively as
 * options are added, edited, or removed.
 *
 * Spinning is driven from the parent: the `rotation` prop is an absolute angle
 * (degrees) applied to the segment group, and `spinning` toggles the
 * fixed-duration deceleration transition. The pointer stays fixed while the
 * segments rotate beneath it.
 */
import { SPIN_DURATION_MS, SPIN_EASING } from './spin';

const CENTER = 100;
const RADIUS = 90;
const LABEL_RADIUS = RADIUS * 0.6;

// Convert a polar coordinate (angle in degrees, 0° = 12 o'clock, clockwise)
// into an SVG cartesian coordinate.
const polarToCartesian = (cx, cy, r, angleDeg) => {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};

// Build the SVG path for a pie slice spanning [startAngle, endAngle].
const arcPath = (cx, cy, r, startAngle, endAngle) => {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
  return [
    `M ${cx} ${cy}`,
    `L ${start.x.toFixed(3)} ${start.y.toFixed(3)}`,
    `A ${r} ${r} 0 ${largeArc} 0 ${end.x.toFixed(3)} ${end.y.toFixed(3)}`,
    'Z',
  ].join(' ');
};

// Evenly spaced, distinct hues around the colour wheel.
const segmentColor = (index, total) =>
  `hsl(${Math.round((index * 360) / total)}, 70%, 55%)`;

const Wheel = ({ options = [], rotation = 0, spinning = false }) => {
  const count = options.length;

  // The segment group rotates around the wheel centre. During a spin we apply
  // a fixed-duration deceleration transition; otherwise the transform snaps
  // instantly (e.g. when options change and the wheel is rebuilt).
  const groupStyle = {
    transform: `rotate(${rotation}deg)`,
    transformOrigin: `${CENTER}px ${CENTER}px`,
    transition: spinning
      ? `transform ${SPIN_DURATION_MS}ms ${SPIN_EASING}`
      : 'none',
  };

  if (count === 0) {
    return (
      <div className="text-center text-muted my-4" data-testid="wheel-empty">
        Add options to build the wheel.
      </div>
    );
  }

  const sliceAngle = 360 / count;

  return (
    <div className="d-flex justify-content-center my-4">
      <svg
        viewBox="0 0 200 200"
        width="300"
        height="300"
        role="img"
        aria-label={`Decision wheel with ${count} option${count !== 1 ? 's' : ''}`}
      >
        {/* Fixed pointer / arrow marking the winning position (top-centre). */}
        <polygon
          data-testid="wheel-pointer"
          points="100,2 91,22 109,22"
          fill="#212529"
        />

        <g data-testid="wheel-rotor" style={groupStyle}>
        {count === 1 ? (
          // A single option fills the whole circle; a degenerate arc can't
          // represent a full 360° sweep, so draw a plain circle instead.
          <g>
            <circle
              data-testid="wheel-segment"
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              fill={segmentColor(0, 1)}
              stroke="#ffffff"
              strokeWidth="1"
            />
            <text
              x={CENTER}
              y={CENTER}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="10"
              fill="#ffffff"
            >
              {options[0]}
            </text>
          </g>
        ) : (
          options.map((opt, i) => {
            const startAngle = i * sliceAngle;
            const endAngle = startAngle + sliceAngle;
            const midAngle = startAngle + sliceAngle / 2;
            const label = polarToCartesian(CENTER, CENTER, LABEL_RADIUS, midAngle);
            return (
              <g key={`${opt}-${i}`}>
                <path
                  data-testid="wheel-segment"
                  d={arcPath(CENTER, CENTER, RADIUS, startAngle, endAngle)}
                  fill={segmentColor(i, count)}
                  stroke="#ffffff"
                  strokeWidth="1"
                />
                <text
                  x={label.x}
                  y={label.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="9"
                  fill="#ffffff"
                  transform={`rotate(${midAngle}, ${label.x}, ${label.y})`}
                >
                  {opt}
                </text>
              </g>
            );
          })
        )}
        </g>
      </svg>
    </div>
  );
};

export default Wheel;
