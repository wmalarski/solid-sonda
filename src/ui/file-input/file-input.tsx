import { type Component, splitProps } from "solid-js";
import type { ComponentVariantProps } from "../utils/types";
import { fileInputRecipe } from "./file-input.recipe";

const fileInputSplitProps = ["color", "size", "variant"] as const;

export type FileInputProps = ComponentVariantProps<"input", typeof fileInputRecipe>;

export const FileInput: Component<FileInputProps> = (props) => {
  const [variants, withoutVariants] = splitProps(props, fileInputSplitProps);

  return (
    <input
      {...withoutVariants}
      type="file"
      class={fileInputRecipe({ ...variants, class: props.class })}
    />
  );
};
