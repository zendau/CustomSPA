import { IVDOMElement, FnComponent } from "@spa/core";
import { useRouter } from "../index";

interface ILinkProps {
  to: string;
  children: IVDOMElement;
}

const Link: FnComponent<ILinkProps> = ({
  to,
  children,
}: {
  to: any;
  children: any;
}) => {
  const router = useRouter();

  function onClick(e: MouseEvent) {
    e.preventDefault();
    router.push(to);
  }

  const body = `<a @click='onClick' href="${to}">{children}</a>`;

  return [{ template: body }, { data: { onClick, children } }];
};

export default Link;
