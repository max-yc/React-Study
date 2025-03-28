import ErrorBox from "../ErrorBox";
import "./index.scss";

const FullPageErrorFallback = ({ error }: { error: Error | null }) => (
  <div className="full-page-error-fallback">
    <ErrorBox error={error} />
  </div>
);

export default FullPageErrorFallback;
