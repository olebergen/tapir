export type TapErrorOptions = {
  url?: string;
  status?: number;
};

export class TapError extends Error {
  url: string | null;
  status: number | null;

  constructor(message: string, options?: TapErrorOptions) {
    super(message);
    this.url = options?.url ?? null;
    this.status = options?.status ?? null;
  }
}
