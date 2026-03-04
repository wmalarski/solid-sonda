import { decode } from "decode-formdata";
import { createSignal, createUniqueId, type Component, type ComponentProps } from "solid-js";
import * as v from "valibot";
import { useI18n } from "~/integrations/i18n";
import { Button } from "~/ui/button/button";
import { FieldError } from "~/ui/field-error/field-error";
import { Fieldset, FieldsetLabel, FieldsetLegend } from "~/ui/fieldset/fieldset";
import { FileInput } from "~/ui/file-input/file-input";
import { FormError } from "~/ui/form-error/form-error";
import { getInvalidStateProps, parseFormValidationError, type FormIssues } from "~/ui/utils/forms";

const ReportUploadFormSchema = v.objectAsync({
  file: v.pipeAsync(
    v.file(),
    v.transformAsync((file) => file.text()),
    v.parseJson(),
    v.objectAsync({
      connections: v.array(
        v.object({
          kind: v.string(),
          original: v.nullable(v.string()),
          source: v.string(),
          target: v.string(),
        }),
      ),
      dependencies: v.array(
        v.object({
          name: v.string(),
          paths: v.array(v.string()),
        }),
      ),
      resources: v.array(
        v.object({
          brotli: v.optional(v.number()),
          format: v.optional(v.string()),
          gzip: v.optional(v.number()),
          kind: v.string(),
          name: v.string(),
          parent: v.nullish(v.string()),
          type: v.string(),
          uncompressed: v.number(),
        }),
      ),
    }),
  ),
});

export const ReportUploadForm: Component = () => {
  const { t } = useI18n();

  const formId = createUniqueId();

  const [issues, setIssues] = createSignal<FormIssues>();

  const onSubmit: ComponentProps<"form">["onSubmit"] = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const parsed = await v.safeParseAsync(
      ReportUploadFormSchema,
      decode(formData, { files: ["file"] }),
    );

    console.log(parsed, formData);

    if (!parsed.success) {
      setIssues(parseFormValidationError(parsed.issues));
      return;
    }

    console.log(parsed, formData);
  };

  return (
    <form id={formId} onSubmit={onSubmit}>
      <Fieldset>
        <FieldsetLegend>{t("board.report.title")}</FieldsetLegend>
        <FormError message={issues()?.error} />

        <FieldsetLabel for="file">{t("board.report.label")}</FieldsetLabel>
        <div class="flex gap-1 w-full">
          <FileInput
            id="file"
            name="file"
            required={true}
            width="full"
            {...getInvalidStateProps({
              errorMessageId: "file-error",
              isInvalid: Boolean(issues()?.errors?.file),
            })}
          />
          <Button type="submit" color="primary">
            {t("common.save")}
          </Button>
        </div>
        <FieldError id="file-error" message={issues()?.errors?.file} />
      </Fieldset>
    </form>
  );
};
