
// STYLED COMPONENT
import { CountBoxWrapper } from "./styles";


// ==============================================================


// ==============================================================

export default function CountBox({
  label,
  value
}) {
  return <CountBoxWrapper>
      <div className="count-box">
        <span>{value}</span>
      </div>

      <span className="label">{label}</span>
    </CountBoxWrapper>;
}