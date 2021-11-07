class Er extends Error {
  status: number;

  constructor(msg: string) {
    super(msg);
    this.status = 0;
  }
}

export default function (status: number, msg?: string) {
  if (status === 403 && !msg) {
    msg = 'not authorized';
  }
  const err = new Er(msg || status.toString());
  err.status = status;
  return err;
}
