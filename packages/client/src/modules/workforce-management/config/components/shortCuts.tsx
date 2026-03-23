import React, { useEffect, useState } from 'react';
import ActivityStyle from '../../../../../styles/Activity.module.css';
import SearchInput from '../../../../components/SearchInput';
import { getAllShortcutKeys } from '../api/get';
import EditShortcutKey from './editShortcutKey';
function index({ startLoading, stopLoading, color }) {
    const [shortCutType, setShortCutType] = useState('global');
    const [shortcutKeys, setShortcutKeys] = useState();
    const handleGetAllShortcutkeys = () => {
        getAllShortcutKeys().then(response => {
            if (response.data.body.status === 'success') {
                setShortcutKeys(response.data.body.data);
            }
        });
    };
    useEffect(() => {
        handleGetAllShortcutkeys();
    }, []);
    useEffect(() => {}, [shortcutKeys]);
    return (
        <>
            <div className='flex flex-wrap'>
                <div className='w-full'>
                    <ul className='flex mb-3 list-none flex-wrap pt-3 pb-4 flex-row m-auto  md:w-96' role='tablist'>
                        <li className='-mb-px mr-2 last:mr-0 flex-auto text-center '>
                            <a
                                className={
                                    'text-base font-bold px-2.5 py-2 shadow-lg rounded block leading-normal rounded-full ' +
                                    (shortCutType === 'global' ? 'text-white bg-indigo-500' : 'text-' + color + '600 bg-white')
                                }
                                onClick={e => {
                                    e.preventDefault();
                                    setShortCutType('global');
                                }}
                                data-toggle='tab'
                                href='#link1'
                                role='tablist'>
                                Global Wise
                            </a>
                        </li>
                        <li className='-mb-px mr-2 last:mr-0 flex-auto text-center '>
                            <a
                                className={
                                    'text-base font-bold px-2.5 py-2 shadow-lg rounded block leading-normal rounded-full ' +
                                    (shortCutType === 'page' ? 'text-white bg-indigo-500' : 'text-' + color + '600 bg-white')
                                }
                                onClick={e => {
                                    e.preventDefault();
                                    setShortCutType('page');
                                }}
                                data-toggle='tab'
                                href='#link2'
                                role='tablist'>
                                Page Wise
                            </a>
                        </li>
                        <li className={`${ActivityStyle.third_li} -mb-px mr-2 last:mr-0 flex-auto text-center`}>
                            <a
                                className={
                                    'text-base font-bold px-2.5 py-2 shadow-lg rounded block leading-normal rounded-full ' +
                                    (shortCutType === 'subPage' ? 'text-white bg-indigo-500' : 'text-' + color + '600 bg-white')
                                }
                                onClick={e => {
                                    e.preventDefault();
                                    setShortCutType('subPage');
                                }}
                                data-toggle='tab'
                                href='#link3'
                                role='tablist'>
                                Sub Page Wise
                            </a>
                        </li>
                    </ul>
                    <div className='relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded'>
                        <div className='px-4 py-5 flex-auto'>
                            <div className='tab-content tab-space'>
                                <div id='link1'>
                                    <div className='flex justify-end'>
                                        <SearchInput onChange={() => {}} placeholder={'Search a shortcut'} />
                                    </div>{' '}
                                    {/* table  */}
                                    <div>
                                        <div className='flex flex-col'>
                                            <div className='overflow-x-auto sm:-mx-6 lg:-mx-8'>
                                                <div className='py-2 inline-block min-w-full sm:px-6 lg:px-8'>
                                                    <div className='overflow-hidden'>
                                                        <table className={`${ActivityStyle.table_short} min-w-full`}>
                                                            <thead className='border-b'>
                                                                <tr>
                                                                    <th scope='col' className={`${ActivityStyle.Headings} text-sm  text-black-900 px-6 py-4 text-left font-black`}>
                                                                        Command
                                                                    </th>
                                                                    <th scope='col' className={`${ActivityStyle.Headings} text-sm  text-black-900 px-6 py-4 text-left font-black`}>
                                                                        Keybinding
                                                                    </th>
                                                                    <th scope='col' className={`${ActivityStyle.Headings} text-sm  text-black-900 px-6 py-4 text-left font-black`}>
                                                                        Source
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {shortcutKeys &&
                                                                    shortcutKeys
                                                                        .filter(item => item.shortCutType === shortCutType)
                                                                        .map(function (data, key) {
                                                                            return (
                                                                                <tr className='bg-white border-b'>
                                                                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                                                                                        <span>{data.feature}</span>
                                                                                    </td>
                                                                                    <td className='text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap' id='keyBinding'>
                                                                                        <label className='pl-2'></label>
                                                                                        <EditShortcutKey
                                                                                            type={''}
                                                                                            data={data}
                                                                                            shortcutType={shortCutType}
                                                                                            {...{ handleGetAllShortcutkeys, startLoading, stopLoading }}
                                                                                        />
                                                                                    </td>
                                                                                    <td className='text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap'>
                                                                                        <span>{data.isDefault ? 'Default' : 'Custom'}</span>
                                                                                    </td>
                                                                                </tr>
                                                                            );
                                                                        })}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* table end */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default index;
