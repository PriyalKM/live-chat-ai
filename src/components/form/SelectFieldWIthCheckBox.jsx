import Select from "react-select"
import { components } from "react-select"
import { Controller, useFormContext } from "react-hook-form"
import { CHEVRON_DOWN_ICON } from "@/lib/images"
import { get } from "lodash"
import { Checkbox } from "../ui/checkbox"


const CustomOption = (props) => {
  const { data, isSelected, innerRef, innerProps, selectOption } = props

  return (
    <div ref={innerRef} {...innerProps} className="flex items-center p-2 gap-3 cursor-pointer">
      <Checkbox
        checked={isSelected}
        onCheckedChange={() => selectOption(data)}
        className="data-[state=checked]:bg-main text-[#777E90] data-[state=checked]:border-main rounded-[6px] size-5"
      />
      <label className="text-secondary font-normal">{data.label}</label>
    </div>
  )
}


const CustomDropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <img src={CHEVRON_DOWN_ICON} className="mr-1.5" />
    </components.DropdownIndicator>
  )
}




const MultiSelectWithCheckbox = ({ prefix = null,placeholder='', options = [], name }) => {

  const { control } = useFormContext();

  const CustomControl = ({ children, ...props }) => {
    return (
      <components.Control className="pl-[15px] sm:pl-5 gap-2" {...props}>
        {prefix && prefix}
        {children}
      </components.Control>
    )
  }
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, formState: { errors } }) => {
        const fieldError = get(errors, name);
        return (
          <div className='space-y-1'>
            <Select
              options={options}
              isMulti
              closeMenuOnSelect={false}
              hideSelectedOptions={false}
              components={{
                Option: (props) => <CustomOption  {...props} selectOption={props.selectOption} />, 
                DropdownIndicator: CustomDropdownIndicator,
                Control: CustomControl,
              }}
              placeholder={placeholder}
              classNames={{
                control: () => '!min-h-[52px] sm:!min-h-[58px]',
                placeholder: () => 'sm:!text-[18px] !text-[16px]',
                valueContainer: () => '!px-0',
                input: () => '!text-base sm:!text-lg',
                menu: () => 'px-3 py-1'
                //placeholder: () => "px-1 max-sm:text-sm sm:px-3",
              }}
              onChange={field.onChange}
              value={field.value}
              styles={{
                control: (provided, state) => ({
                  ...provided,
                  backgroundColor: '#f8f9f9',
                  borderWidth: state.isFocused ? 0 : 0,
                  borderRadius: 12,
                  boxShadow: state.isFocused ? errors[name]?.message ? '0 0 0 1px #EF4444' : '0 0 0 1px #00504A' : 'none',
                  // minHeight:'58px',
                  // borderRadius:''
                  // backgroundColor: '#F5F5F5',
                  // borderRadius: '12px',
                  // borderWidth: state.isFocused ? 0 : 0,
                  // boxShadow: state.isFocused ?errors[name]?.message?'0 0 0 1px #EF4444': '0 0 0 1px #8DC1FF' : 'none',
                  // '&:hover': {
                  //     borderWidth: 0,
                  // },
                }),
                valueContainer: (base) => ({
                  ...base,
                  paddingLeft: "4px",
                }),
                placeholder: (provided) => ({
                  ...provided,
                  color: '#969696',
                  fontWeight: 300
                }),
                input: (provided) => ({
                  ...provided,
                  color: '#1D1D1D',
                  fontWeight: 400,
                }),
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isSelected ? '#8DC1FF' : state.isFocused ? '#E6F0FF' : 'white',
                  color: state.isSelected ? 'black' : 'black'
                }),
                indicatorSeparator: (base) => ({
                  ...base,
                  display: 'none'
                }),
                menu: (provided) => ({
                  ...provided,
                  backgroundColor: 'white',
                  borderRadius: 10
                }),
                menuList: (provided) => ({
                  ...provided,
                  backgroundColor: 'white',
                  borderRadius: 10
                }),
              }}
            />
            {fieldError?.message && <div className='pt-1 pl-3 text-xs sm:text-sm  font-normal text-red-500'>{fieldError?.message}</div>}
          </div>
        )
      }}
    />
  )
}

export default MultiSelectWithCheckbox;
