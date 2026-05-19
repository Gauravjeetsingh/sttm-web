import React, { useEffect, useState } from 'react';
import { Location } from 'history';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { pageView } from '../../util/analytics';
import BreadCrumb from '../../components/Breadcrumb';

interface MatchParams {
  shabadId: string;
}

interface ExplainVerse {
  gurmukhi: string;
  english: string;
  punjabi: string;
}

interface ExplainData {
  shabadId: number | string;
  verses: ExplainVerse[];
}

interface LocationState {
  explainData?: ExplainData;
}

interface ExplainProps extends RouteComponentProps<MatchParams> {
  location: Location<LocationState>;
}

interface ExplanationResponse {
  summary: string;
  verses: { gurmukhi: string; explanation: string }[];
  key_takeaways: string[];
  daily_routine: string[];
}

const Explain: React.FC<ExplainProps> = ({ match, location }) => {
  const { shabadId } = match.params;
  const explainData = location.state && location.state.explainData;

  const [explanation, setExplanation] = useState<ExplanationResponse | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!explainData) {
      return;
    }

    pageView(`/explain/${shabadId}`);

    let cancelled = false;

    fetch('/api/explain-shabad', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(explainData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }
        return res.json();
      })
      .then((data: ExplanationResponse) => {
        if (!cancelled) {
          setExplanation(data);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || 'Failed to generate explanation');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [shabadId, explainData]);

  // Opened directly (no data passed) — send the user to the shabad page,
  // which fetches the data and exposes the Explain button.
  if (!explainData) {
    return <Redirect to={`/shabad?id=${shabadId}`} />;
  }

  return (
    <div className="row" id="content-root">
      <BreadCrumb links={[{ title: `Explain Shabad ${shabadId}` }]} />
      <div className="wrapper">
        {error && (
          <div className="explain-error">
            Could not generate the explanation: {error}
          </div>
        )}

        {!error && !explanation && (
          <div className="explain-loading">
            <div className="spinner" />
            <p>Generating explanation…</p>
          </div>
        )}

        {explanation && (
          <div className="explain-content">
            <h4>Summary</h4>
            <p>{explanation.summary}</p>

            <h4>Verses</h4>
            {explanation.verses.map((verse, i) => (
              <div key={i} className="explain-verse">
                <div className="gurmukhi gurbani-display gurbani-font">
                  {verse.gurmukhi}
                </div>
                <p>{verse.explanation}</p>
              </div>
            ))}

            <h4>Key Takeaways</h4>
            <ul>
              {explanation.key_takeaways.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>

            <h4>Bringing It Into Daily Life</h4>
            <ul>
              {explanation.daily_routine.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explain;
