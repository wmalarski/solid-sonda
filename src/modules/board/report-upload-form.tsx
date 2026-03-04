import { decode } from "decode-formdata";
import { createSignal, createUniqueId, type Component, type ComponentProps } from "solid-js";
import * as v from "valibot";
import { useI18n } from "~/integrations/i18n";
import { ReportAsyncSchema, type ReportModel } from "~/integrations/sonda/schema";
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
    ReportAsyncSchema,
  ),
});

type ReportUploadFormProps = {
  onReportSubmit: (report: ReportModel) => void;
};

export const ReportUploadForm: Component<ReportUploadFormProps> = (props) => {
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

    if (!parsed.success) {
      setIssues(parseFormValidationError(parsed.issues));
      return;
    }

    props.onReportSubmit(parsed.output.file);
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
