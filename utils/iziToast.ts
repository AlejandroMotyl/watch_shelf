export async function showError(error: string) {
  const { default: iziToast } = await import("izitoast");

  iziToast.error({
    class: "iziToastError",
    theme: "dark",
    title: "Hey",
    message: error,
  });
}

export async function showMessage(message: string) {
  const { default: iziToast } = await import("izitoast");

  iziToast.show({
    class: "iziToastSuccess",
    theme: "dark",
    title: "Hey",
    message,
  });
}
