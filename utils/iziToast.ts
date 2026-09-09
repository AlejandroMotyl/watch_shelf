export async function showError(message: string) {
  const { default: iziToast } = await import("izitoast");

  iziToast.error({
    class: "iziToastError",
    theme: "dark",
    title: "Something went wrong",
    message,
    position: "topRight",
    timeout: 4000,
    close: true,
    progressBar: true,
  });
}

export async function showMessage(message: string) {
  const { default: iziToast } = await import("izitoast");

  iziToast.show({
    class: "iziToastSuccess",
    theme: "dark",
    title: "Success",
    message,
    position: "topRight",
    timeout: 3000,
    close: true,
    progressBar: true,
  });
}
