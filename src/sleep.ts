async function sleep(millisecond: number) {
  return new Promise((resolve) => setTimeout(resolve, millisecond));
}

export default sleep;
