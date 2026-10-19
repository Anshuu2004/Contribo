export type ContributorReadiness = {
  score: number;
  completed: number;
  total: number;
  hint: string;
  ready: boolean;
};

type ReadinessInput = {
  displayName?: string | null;
  skills?: string[] | null;
  savedCount: number;
  applicationCount: number;
};

const TOTAL_SIGNALS = 4;

/**
 * Four onboarding signals, one quarter each. The score is derived from the
 * current dashboard state and only moves up as steps are completed.
 */
export function calculateContributorReadiness({
  displayName,
  skills,
  savedCount,
  applicationCount,
}: ReadinessInput): ContributorReadiness {
  const name = typeof displayName === 'string' ? displayName.trim() : '';
  const hasRealName = name.length > 0 && name !== 'Contributor';
  const hasSkills = Array.isArray(skills)
    ? skills.some((skill) => typeof skill === 'string' && skill.trim().length > 0)
    : false;

  const completed = [hasRealName, hasSkills, savedCount > 0, applicationCount > 0].filter(
    Boolean
  ).length;
  const score = Math.round((completed / TOTAL_SIGNALS) * 100);

  let hint = 'Complete your profile to get started';
  if (completed === TOTAL_SIGNALS) {
    hint = 'Profile active & ready';
  } else if (completed > 0) {
    if (!hasRealName) hint = 'Set your display name';
    else if (!hasSkills) hint = 'Add skills to your profile';
    else if (savedCount <= 0) hint = 'Save a target organization';
    else if (applicationCount <= 0) hint = 'Track your first application';
  }

  return {
    score,
    completed,
    total: TOTAL_SIGNALS,
    hint,
    ready: score === 100,
  };
}
