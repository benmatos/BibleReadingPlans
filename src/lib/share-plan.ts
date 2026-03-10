
export interface SharedPlan {
  name: string;
  startBook: string;
  endBook: string;
}

export function getShareUrl(plan: SharedPlan, origin: string): string {
  const params = new URLSearchParams({
    name: plan.name,
    startBook: plan.startBook,
    endBook: plan.endBook,
  });
  return `${origin}/invite?${params.toString()}`;
}

export function decodePlanFromParams(params: URLSearchParams): SharedPlan | null {
  const name = params.get('name');
  const startBook = params.get('startBook');
  const endBook = params.get('endBook');

  if (!name || !startBook || !endBook) {
    return null;
  }

  return { name, startBook, endBook };
}
