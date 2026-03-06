import { type Component, splitProps } from "solid-js";
import type { ComponentVariantProps } from "../utils/types";
import {
  menuDropdownRecipe,
  menuDropdownToggleRecipe,
  menuItemRecipe,
  menuRecipe,
  menuTitleRecipe,
} from "./menu.recipe";

export type MenuProps = ComponentVariantProps<"ul", typeof menuRecipe>;

export const Menu: Component<MenuProps> = (props) => {
  const [variants, withoutVariants] = splitProps(props, ["direction", "size"]);
  return <ul {...withoutVariants} class={menuRecipe({ class: props.class, ...variants })} />;
};

export type MenuItemProps = ComponentVariantProps<"li", typeof menuItemRecipe>;

export const MenuItem: Component<MenuItemProps> = (props) => {
  const [variants, withoutVariants] = splitProps(props, ["behaviour"]);
  return <li {...withoutVariants} class={menuItemRecipe({ class: props.class, ...variants })} />;
};

export type MenuTitleProps = ComponentVariantProps<"li", typeof menuTitleRecipe>;

export const MenuTitle: Component<MenuTitleProps> = (props) => {
  return <li {...props} class={menuTitleRecipe({ class: props.class })} />;
};

export type MenuDropdownProps = ComponentVariantProps<"ul", typeof menuDropdownRecipe>;

export const MenuDropdown: Component<MenuDropdownProps> = (props) => {
  const [variants, withoutVariants] = splitProps(props, ["show"]);
  return (
    <ul {...withoutVariants} class={menuDropdownRecipe({ class: props.class, ...variants })} />
  );
};

export type MenuDropdownToggleProps = ComponentVariantProps<
  "span",
  typeof menuDropdownToggleRecipe
>;

export const MenuDropdownToggle: Component<MenuDropdownToggleProps> = (props) => {
  const [variants, withoutVariants] = splitProps(props, ["show"]);
  return (
    <span
      {...withoutVariants}
      class={menuDropdownToggleRecipe({ class: props.class, ...variants })}
    />
  );
};
