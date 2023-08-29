import { IVDOMElement } from "@core/interfaces/IVDOMElement";
import { FnComponent } from "@core/interfaces/componentType";
import { useRouter } from "@core/libs/router";

interface ILinkProps {
  to: string;
  children: IVDOMElement;
}

const Link: FnComponent<ILinkProps> = ({ to, children }) => {
  const router = useRouter();

  function test(e: MouseEvent) {
    e.preventDefault();
    router.push(to);
  }

  const body = `<a @click='test' href="${to}">{children}</a>`;

  return [body, { data: { test, children } }];
};

export default Link;
