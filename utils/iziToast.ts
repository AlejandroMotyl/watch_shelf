import iziToast from "izitoast";

export function showError(er: string) {
  iziToast.error({
    class: "iziToastError",
    theme: "dark",
    title: "Hey",
    message: er,
  });
}

export function showMessage(msg: string) {
  iziToast.show({
    class: "iziToastSuccess",
    theme: "dark",
    title: "Hey",
    message: msg,
  });
}
