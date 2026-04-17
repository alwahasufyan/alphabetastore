import { StatusWrapper } from "./styles";


// ==============================================================


// ==============================================================

export default function ProductStatus({
  status
}) {
  return status ? <StatusWrapper>
      <span className="chip">{status}</span>

      <div className="triangle">
        <div className="triangle-left" />
        <div className="triangle-right" />
      </div>
    </StatusWrapper> : null;
}