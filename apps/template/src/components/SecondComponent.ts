import { FnComponent } from "@spa/core";

interface IProps {
  msg: string;
}

const SecondComponent: FnComponent<IProps> = ({ msg }) => {
  const body = `
    <>
      <h2>Hello from second component with message - {msg}</h2>
    </>`;

  return [
    { template: body },
    {
      data: {
        msg,
      },
      onUnmounted: () => console.log("UNMOUNTED SECODND"),
      onMounted: () => console.log("MOUNTED SECODND"),
      onBeforeMounted: () => console.log("ON BEFORE MOUNTE SECOND"),
      onBeforeUpdate: () => console.log("BEFORE UPDATE SECOND"),
      onUpdate: () => console.log("UPDATE SECOND"),
    },
  ];
};

export default SecondComponent;
