import type {
  Option,
  OptionGroup,
  OptionGroupPublicInfo,
  OptionPublicInfo,
  SortedOptions,
} from "../type";

export const optionSort = (
  optionGroups: OptionGroup[] | OptionGroupPublicInfo[],
  options: Option[] | OptionPublicInfo[]
) => {
  if (optionGroups.length > 0) {
    const sortedOption: SortedOptions[] = optionGroups.map((group) => {
      const sortedOptions = options.filter((item) => {
        return item.optionGroupId === group.optionGroupId;
      });
      const optionGroupId = group.optionGroupId;
      const groupName = group.optionGroupName;
      const required = group.required;
      const selectionType = group.selectionType;
      const optionCount = group.optionCount ? group.optionCount : 0;
      return {
        optionGroupId,
        groupName,
        required,
        selectionType,
        optionCount,
        options: sortedOptions,
      };
    });
    return sortedOption;
  } else {
    return undefined;
  }
};
